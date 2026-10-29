import React, { Component } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import TipFormContainer from '../components/TipFormContainer';
import TipFormIntro from '../components/TipFormIntro';
import TipFormSuspect from '../components/TipFormSuspect';
import TipFormVehicle from '../components/TipFormVehicle';
import TipFormDrugs from '../components/TipFormDrugs';
import TipFormMedia from '../components/TipFormMedia';
import TipFormConclusion from '../components/TipFormConclusion';
import About from './About';
import FAQ from './FAQ';
import { language } from '../helpers/languages';
import { api } from '../api';
import { omitUnchanged } from '../helpers/helpers';
import { useBranding } from '../branding';

class HomeInner extends Component {
  constructor() {
    super();
    this.state = {
      tip: {
        timestampStart: Date.now(),
        tipType: 'web',
        numberOfSuspects: 1,
        numberOfVehicles: 0,
        submitted: false,
        tipText: '',
      },
      tipKey: null,
      editToken: null,
      moduleIndex: 0,
      formModules: ['intro', 'suspect', 'vehicle', 'drugs', 'media', 'final', 'success'],
      showFormModule: {
        intro: true,
        suspect: true,
        vehicle: false,
        drugs: false,
        media: false,
        final: true,
        success: true,
      },
      error: {
        crimeType: null,
        tipText: null,
      },
      language: 'english',
      saving: false,
    };
    this.baseState = JSON.parse(JSON.stringify(this.state));
    this.draftCreated = false;
  }

  componentDidMount() {
    this.syncModuleFromPath(this.props.location.pathname);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.syncModuleFromPath(this.props.location.pathname);
    }

    if (
      !this.state.tipKey &&
      !this.draftCreated &&
      (this.state.tip.tipText || '').length >= 20
    ) {
      this.draftCreated = true;
      this.createDraftTip();
    } else if (
      this.state.tipKey &&
      prevState.tip !== this.state.tip &&
      !this.state.tip.submitted
    ) {
      this.scheduleUpdate(this.state.tip, prevState.tip);
    }
  }

  syncModuleFromPath = (pathname) => {
    const map = {
      '/': 0,
      '/suspect': 1,
      '/vehicle': 2,
      '/drugs': 3,
      '/media': 4,
      '/final': 5,
      '/success': 6,
      '/about': 'about',
      '/faq': 'faq',
    };
    const moduleIndex = map[pathname];
    if (moduleIndex !== undefined) this.setState({ moduleIndex });
  };

  scheduleUpdate = (tipNow, tipPrev) => {
    clearTimeout(this.updateTimer);
    this.updateTimer = setTimeout(() => this.updateTip(tipNow, tipPrev), 300);
  };

  createDraftTip = async () => {
    try {
      const { tip, editToken } = await api.createTip({
        ...this.state.tip,
        submitted: false,
      });
      this.setState({ tipKey: tip.id, editToken: editToken || null });
    } catch (err) {
      console.error(err);
      this.draftCreated = false;
    }
  };

  updateTip = async (tipNow, tipPrev) => {
    if (!this.state.tipKey || !this.state.editToken) return;
    const updated = omitUnchanged(tipNow, tipPrev);
    if (Object.keys(updated).length === 0) return;
    try {
      await api.updateTip(this.state.tipKey, updated, this.state.editToken);
    } catch (err) {
      console.error(err);
    }
  };

  handleInputChange = (e, { name, value }) => {
    const tip = { ...this.state.tip, [name]: value };
    this.setState({ tip });
  };

  handleCheckChange = (e, { name }) => {
    const tip = { ...this.state.tip };
    tip[name] = tip[name] ? !tip[name] : true;
    this.setState({ tip });
  };

  handleFormModuleChange = (e, { name, value }) => {
    const showFormModule = { ...this.state.showFormModule };
    if (name === 'crimeType') {
      showFormModule.drugs = value === 'Drugs';
    }
    if (name === 'numberOfSuspects') {
      showFormModule.suspect = value > 0;
    }
    if (name === 'numberOfVehicles') {
      showFormModule.vehicle = value > 0;
    }
    if (name === 'tipsterHasMedia') {
      showFormModule.media = !showFormModule.media;
    }
    this.setState({ showFormModule });
  };

  addRemoveSuspectVehicle = (field, number) => {
    const tip = { ...this.state.tip, [field]: this.state.tip[field] + number };
    this.setState({ tip });
  };

  onAttachmentsChange = (attachments) => {
    const tip = { ...this.state.tip, attachments };
    this.setState({ tip });
  };

  submitTip = async (event) => {
    event.preventDefault();
    const tip = {
      ...this.state.tip,
      submitted: true,
      timestampSubmit: Date.now(),
      read: false,
      archived: false,
      important: false,
    };
    try {
      let tipKey = this.state.tipKey;
      if (!tipKey) {
        const created = await api.createTip({ ...tip, submitted: true });
        tipKey = created.tip.id;
      } else {
        await api.submitTip(tipKey, tip, this.state.editToken);
      }
      this.setState({ tipKey, tip, editToken: null, moduleIndex: 6 });
      this.props.navigate('/success');
    } catch (err) {
      console.error(err);
    }
  };

  validateIntroModule = () => {
    const crimeTypeError = this.state.tip.crimeType == null;
    const tipTextError =
      this.state.tip.tipText == null || this.state.tip.tipText.length < 20;

    if (crimeTypeError || tipTextError) {
      this.setState({
        error: {
          crimeType: crimeTypeError || null,
          tipText: tipTextError || null,
        },
      });
    } else {
      const newModuleIndex = this.checkModuleIndex('next');
      this.setState({
        moduleIndex: newModuleIndex,
        error: { crimeType: null, tipText: null },
      });
      this.navigateTo(newModuleIndex);
    }
  };

  checkModuleIndex = (direction) => {
    const { moduleIndex } = this.state;
    let changeIndex = true;
    let i = 1;
    let newModuleIndex;
    do {
      newModuleIndex = direction === 'next' ? moduleIndex + i : moduleIndex - i;
      if (this.state.showFormModule[this.state.formModules[newModuleIndex]] === false) {
        i += 1;
      } else {
        changeIndex = false;
      }
    } while (changeIndex);
    return newModuleIndex;
  };

  navigateTo = (newModuleIndex) => {
    const formModule = this.state.formModules[newModuleIndex];
    if (formModule === 'intro') this.props.navigate('/');
    else this.props.navigate(`/${formModule}`);
  };

  changeFormWizardIndex = (direction) => {
    const { moduleIndex } = this.state;
    if (direction === 'next') {
      if (moduleIndex === 0) {
        this.validateIntroModule();
      } else if (moduleIndex === 5) {
        // submit handled separately
      } else {
        const newModuleIndex = this.checkModuleIndex(direction);
        this.setState({ moduleIndex: newModuleIndex });
        this.navigateTo(newModuleIndex);
      }
    } else if (direction === 'previous') {
      const newModuleIndex = this.checkModuleIndex(direction);
      this.setState({ moduleIndex: newModuleIndex });
      this.navigateTo(newModuleIndex);
    }
  };

  displayFormModule = (moduleIndex) => {
    const contentToDisplay = this.state.formModules[moduleIndex];
    const lang = language[this.state.language];

    switch (contentToDisplay) {
      case 'intro':
        return (
          <TipFormContainer
            title={lang.submitATip}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="intro"
            nextButton
            lang={lang}
          >
            <TipFormIntro
              handleInputChange={this.handleInputChange}
              handleCheckChange={this.handleCheckChange}
              handleFormModuleChange={this.handleFormModuleChange}
              tip={this.state.tip}
              error={this.state.error}
              lang={lang}
            />
          </TipFormContainer>
        );
      case 'suspect':
        return (
          <TipFormContainer
            title={lang.suspect}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="suspect"
            previousButton
            nextButton
            lang={lang}
          >
            <TipFormSuspect
              handleInputChange={this.handleInputChange}
              addRemoveSuspectVehicle={this.addRemoveSuspectVehicle}
              tip={this.state.tip}
              lang={lang}
            />
          </TipFormContainer>
        );
      case 'vehicle':
        return (
          <TipFormContainer
            title={lang.vehicle}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="vehicle"
            previousButton
            nextButton
            lang={lang}
          >
            <TipFormVehicle
              handleInputChange={this.handleInputChange}
              addRemoveSuspectVehicle={this.addRemoveSuspectVehicle}
              tip={this.state.tip}
              lang={lang}
            />
          </TipFormContainer>
        );
      case 'drugs':
        return (
          <TipFormContainer
            title={lang.drugs}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="drugs"
            previousButton
            nextButton
            lang={lang}
          >
            <TipFormDrugs
              handleInputChange={this.handleInputChange}
              tip={this.state.tip}
              lang={lang}
            />
          </TipFormContainer>
        );
      case 'media':
        return (
          <TipFormContainer
            title={lang.mediaCard}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="media"
            previousButton
            nextButton
            lang={lang}
          >
            <TipFormMedia
              tip={this.state.tip}
              tipKey={this.state.tipKey}
              editToken={this.state.editToken}
              lang={lang}
              onAttachmentsChange={this.onAttachmentsChange}
            />
          </TipFormContainer>
        );
      case 'final':
        return (
          <TipFormContainer
            title={lang.final}
            changeFormWizardIndex={this.changeFormWizardIndex}
            showFormModule={this.state.showFormModule}
            activeModule="final"
            previousButton
            showSubmit
            createTip={this.submitTip}
            lang={lang}
          >
            <TipFormConclusion
              handleInputChange={this.handleInputChange}
              handleCheckChange={this.handleCheckChange}
              tip={this.state.tip}
              lang={lang}
            />
          </TipFormContainer>
        );
      case 'success':
        return (
          <TipFormContainer
            title={lang.thankYou}
            showFormModule={this.state.showFormModule}
            activeModule="success"
            changeFormWizardIndex={this.changeFormWizardIndex}
            lang={lang}
          >
            <p>{lang.finalLine1}</p>
            <p>
              {lang.finalLine2a} <b>{this.state.tipKey}</b>. Save it as a reference.
            </p>
            <p>
              <a
                href="#reset"
                onClick={(e) => {
                  e.preventDefault();
                  this.draftCreated = false;
                  this.setState(JSON.parse(JSON.stringify(this.baseState)));
                  this.props.navigate('/');
                }}
              >
                {lang.finalLine3a}
              </a>
              {lang.finalLine3b}
            </p>
          </TipFormContainer>
        );
      default:
        return null;
    }
  };

  render() {
    let displayComponent = null;
    if (this.state.moduleIndex === 'about') {
      displayComponent = <About lang={language[this.state.language]} />;
    } else if (this.state.moduleIndex === 'faq') {
      displayComponent = <FAQ lang={language[this.state.language]} />;
    } else {
      displayComponent = this.displayFormModule(this.state.moduleIndex);
    }

    const showHero =
      this.state.moduleIndex !== 'about' && this.state.moduleIndex !== 'faq';
    const brandName = this.props.branding?.name || 'Crime Tips';
    // Split last word for the gold accent span when name has 2+ words
    const parts = brandName.trim().split(/\s+/);
    const heroLead =
      parts.length > 1 ? (
        <>
          {parts.slice(0, -1).join(' ')} <span>{parts[parts.length - 1]}</span>
        </>
      ) : (
        brandName
      );

    return (
      <Layout>
        {showHero && (
          <header className="public-hero">
            {this.props.branding?.logoUrl ? (
              <img
                className="public-hero__logo"
                src={this.props.branding.logoUrl}
                alt=""
              />
            ) : null}
            <h1 className="public-hero__brand">{heroLead}</h1>
            <p className="public-hero__lead">
              Share information with police confidentially. Your tip helps keep the community safe.
            </p>
            <hr className="public-hero__rule" />
          </header>
        )}
        {displayComponent}
      </Layout>
    );
  }
}

export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const branding = useBranding();
  return <HomeInner location={location} navigate={navigate} branding={branding} />;
}

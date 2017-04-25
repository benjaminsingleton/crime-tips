const language = {
  english: {
    submitATip: 'Submit a Tip',
    incident: 'Incident',
    suspect: 'Suspect',
    vehicle: 'Vehicle',
    drugs: 'Drugs',
    mediaCard: 'Upload Media',
    mediaBreadcrumb: 'Media',
    final: 'Final',
    conclusion: 'Conclusion',
    thankYou: 'Thank You!',
    cardSubtitle: 'All tips are completely anonymous. Your community needs your help.',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    finalLine1: "You've done your community a great service!",
    finalLine2a: "You're tip number is:",
    finalLine2b: 'Save it as a reference.',
    finalLine3a: 'Click here',
    finalLine3b: 'to write another tip.',
    OptionalMsg: 'All of questions are optional so skip any questions you can’t answer.',
    about: 'About',
    aboutSubtitle: 'A brief background on Crime Tips 24/7',
    aboutContent: `Founded in 2017, Crime Tips 24/7 was created to enable concerned members of the public 
          to share information about crimes with the police via a user-friendly form. In the spirit of
          transparency, Crime Tips 24/7 has been open-sourced and is available at 
          https://github.com/benjaminsingleton/crime-tips. Police Departments can set up their own tips website
          for free, or pay Crime Tips 24/7 to manage the site for them. The company was founded
          by Benjamin Singleton, the Lead for Public Safety and Criminal Justice at Sidewalk Labs 
          (an Alphabet/Google company) and a former New York Police Department crime analyst.`,
    faq: 'FAQ',
    faqSubtitle: 'Your questions answered.',
    faq1Question: 'What is Crime Tips 24/7?',
    faq1Answer: `Crime Tips 24/7 is a website that allows concerned members of the public to submit anonymous
					tips to their police department.'`,
    faq2Question: 'What is a tip?',
    faq2Answer: `A tip is information about an unsolved crime, a wanted fugitive, a missing person, narcotics activity, 
					suspicious activity, bullying, and any other issue of interest to the police. Any information you can 
					provide might be of value, no matter how important or unimportant you believe it to be. Tipsters 
					are not snitches -- they care about their community.`,
    faq3Question: 'What is not a tip?',
    faq3Answer: `This website is not a substitute for the 9-1-1 emergency system. In the event 
					of an emergency, call the 9-1-1 emergency system immediately!`,
    faq4Question: 'What will you do with the information you get from a tip?',
    faq4Answer: `Once a tip is received, a detective will review the information and determine who should 
					investigate the information provided. All tip information will be closely examined.`,
    faq5Question: 'How do I know that I will remain anonymous?',
    faq5Answer: `We guarantee complete anonymity — no IP addresses or any identifying information is saved. In 
					fact, we have made our source code publicly available on Github so you can even review it yourself.`,
    faq6Question: 'I want to provide information, but I’m concerned. What should I do?',
    faq6Answer: `We understand that providing information can put you in an uncomfortable situation, but the 
					community depends on people like you to identify known and suspected criminals. As always, 
					call 911 if you are in imminent danger.`,
    faq7Question: 'How do I know if I am eligible to receive a reward?',
    faq7Answer: `Contact the Department to update your tip information or to check the status on your reward. 
					Please have your tip number ready as no information will be provided to you without it. 
					A representative of the Department will let you know if an arrest has been made and a reward 
					is available or the status of the investigation.`,
    faq8Question: 'How do I collect my reward?',
    faq8Answer: `After you check the status of your tip and verified that you are eligible to receive a reward, 
					a representative from the Department will provide you with instructions for collecting your 
					reward from the bank. You will not need to provide personal identification to the bank; you will 
					be receiving cash.`,
    crimeType: {
      label: 'What kind of crime was committed?',
      placeholder: 'Select a crime type',
      required: 'Required Field',
      error: 'Please select a crime type.'
    },
    tipText: {
      label: 'Please tell us the information you wanted to share.',
      placeholder: 'Tip description',
      required: 'Required Field',
      error: 'Your description is too brief. 20 characters minimum.'
    },
    crimeLocation: {
      label: 'Where did the crime take place?',
      placeholder: 'Crime Location'
    },
    crimeDate: {
      label: 'When did the crime occur?',
      placeholder: 'Crime date'
    },
    numberOfSuspects: {
      label: 'How many suspects were involved?',
      placeholder: 'Select a number'
    },
    numberOfVehicles: {
      label: 'How many vehicles were involved?',
      placeholder: 'Select a number'
    },
    tipsterHasMedia: {
      label: 'I have media (such as an image or video) to upload.',
    },
    suspectFullName: {
      label: 'Full name',
      placeholder: 'First and last name'
    },
    suspectNickname: {
      label: 'Nickname / alias',
      placeholder: 'Nickname',
    },
    suspectDateOfBirth: {
      label: 'Date of Birth',
      placeholder: 'MM/DD/YYYY'
    },
    suspectAge: {
      label: 'Approximate age',
      placeholder: 'Age'
    },
    suspectGender: {
      label: 'Gender',
      placeholder: 'Select a gender'
    },
    suspectRace: {
      label: 'Race',
      placeholder: 'Select a race'
    },
    suspectHeight: {
      label: 'Height',
      placeholder: 'Select a height'
    },
    suspectWeight: {
      label: 'Weight',
      placeholder: 'Weight'
    },
    suspectAddress: {
      label: 'Home address',
      placeholder: 'Home address'
    },
    suspectCity: {
      label: 'City',
      placeholder: 'City'
    },
    suspectState: {
      label: 'State',
      placeholder: 'Select a state'
    },
    suspectPhone: {
      label: 'Phone number',
      placeholder: 'XXX-XXX-XXXX'
    },
    suspectMarkings: {
      label: 'Scars, Marks, Tattoos, Piercings',
      placeholder: 'Identifying markings'
    },
    suspectGang: {
      label: 'Gang membership',
      placeholder: 'Gang name'
    },
    suspectSocialMedia: {
      label: 'Social media accounts (e.g. Facebook, Instagram, Twitter)',
      placeholder: 'e.g. https://www.facebook.com/username'
    },
    suspectWeapon: {
      label: 'Does the suspect carry weapons? What kind?',
      placeholder: 'Weapon'
    },
    suspectEmployer: {
      label: 'Place of employment',
      placeholder: 'Employer name'
    },
    suspectComments: {
      label: 'Is there anything else we should know about the suspect?',
      placeholder: 'Additional details'
    },
    vehicleMake: {
      label: 'What is the vehicle make?',
      placeholder: 'Select a make'
    },
    vehicleModel: {
      label: 'What is the vehicle model?',
      placeholder: 'Select a model'
    },
    vehicleColor: {
      label: 'What is the color of the vehicle?',
      placeholder: 'Select a color'
    },
    vehiclePlate: {
      label: 'What is the license plate number?',
      placeholder: 'License plate number'
    },
    vehicleLocation: {
      label: 'Where can the vehicle usually be found?',
      placeholder: 'Vehicle location'
    },
    vehicleMarkings: {
      label: 'Please note if the vehicle has any identifying marks, scratches, bumper stickers, etc.',
      placeholder: 'Vehicle markings'
    },
    drugType: {
      label: 'What drug is possessed / being sold?',
      placeholder: 'Select a drug type'
    },
    drugSaleMethod: {
      label: 'How are the drugs being sold?',
      placeholder: 'Select a method'
    },
    drugSaleTime: {
      label: 'What time of day are drugs sold?',
      placeholder: 'e.g., 10am-4pm on weekdays'
    },
    drugSalePhoneNumber: {
      label: 'What is the phone number used to buy drugs',
      placeholder: 'XXX-XXX-XXXX'
    },
    media: {
      label: 'Upload as many files as you need. Accepted file types include images, videos, screenshots, documents, etc.'
    },
    tipsterAwareOfCrimeMethod: {
      label: 'How are you aware of this crime?',
      placeholder: 'Select a source'
    },
    websiteDiscoveryMethod: {
      label: 'How did you find out about online crime tips?',
      placeholder: 'Select an option'
    },
    tipsterWantsToBeContacted: {
      label: 'I know my tip is anonymous, but now I want to be contacted by the police if they have additional questions.',
    },
    tipsterContactDetails: {
      label: 'Please provide your contact details.',
      placeholder: 'Contact information'
    }
  }
}

export { language }
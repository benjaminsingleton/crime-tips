import React from 'react';

const Submitted = ({ tipKey, lang }) => (
  <div>
    <p>{lang.finalLine1}</p>
    <p>{lang.finalLine2a} <b>{tipKey}</b>. Save it as a reference.</p>
    <p>
      <a onClick={() => this.setState(this.baseState)}>{lang.finalLine3a}</a>
      {lang.finalLine3b}
    </p>
  </div>
);

export default Submitted;

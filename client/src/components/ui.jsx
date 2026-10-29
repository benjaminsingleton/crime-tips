import React from 'react';
import PropTypes from 'prop-types';

/** Emit Semantic-UI-style onChange: (e, { name, value }) */
function emitChange(onChange, name, value, e) {
  if (!onChange) return;
  onChange(e, { name, value });
}

export function Button({
  children,
  content,
  variant = 'secondary',
  type = 'button',
  className = '',
  block,
  size,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    block ? 'btn--block' : '',
    size === 'sm' ? 'btn--sm' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <button type={type} className={classes} {...rest}>
      {content ?? children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  content: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger', 'danger-outline']),
  type: PropTypes.string,
  className: PropTypes.string,
  block: PropTypes.bool,
  size: PropTypes.oneOf(['sm', undefined]),
};

export function Field({ label, error, children, className = '', hint }) {
  return (
    <div className={['field', error ? 'is-error' : '', className].filter(Boolean).join(' ')}>
      {label ? <label className="field__label">{label}</label> : null}
      {children}
      {hint ? <span className="field__hint">{hint}</span> : null}
    </div>
  );
}

Field.propTypes = {
  label: PropTypes.node,
  error: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  hint: PropTypes.node,
};

export function TextInput({
  label,
  name,
  value,
  onChange,
  type = 'text',
  placeholder,
  error,
  className,
  ...rest
}) {
  return (
    <Field label={label} error={error} className={className}>
      <input
        className="input"
        name={name}
        type={type}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => emitChange(onChange, name, e.target.value, e)}
        {...rest}
      />
    </Field>
  );
}

TextInput.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  className: PropTypes.string,
};

export function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  className,
  ...rest
}) {
  return (
    <Field label={label} error={error} className={className}>
      <textarea
        className="textarea"
        name={name}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => emitChange(onChange, name, e.target.value, e)}
        {...rest}
      />
    </Field>
  );
}

TextArea.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  className: PropTypes.string,
};

export function Select({
  label,
  name,
  value,
  onChange,
  options = [],
  placeholder,
  error,
  className,
  ...rest
}) {
  return (
    <Field label={label} error={error} className={className}>
      <select
        className="select"
        name={name}
        value={value ?? ''}
        onChange={(e) => {
          const raw = e.target.value;
          const opt = options.find((o) => String(o.value) === raw);
          const next = opt ? opt.value : raw;
          emitChange(onChange, name, next, e);
        }}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled={value !== undefined && value !== null && value !== ''}>
            {placeholder}
          </option>
        ) : null}
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.text ?? opt.label ?? opt.value}
          </option>
        ))}
      </select>
    </Field>
  );
}

Select.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  options: PropTypes.array,
  placeholder: PropTypes.string,
  error: PropTypes.bool,
  className: PropTypes.string,
};

export function Checkbox({ label, name, checked, onChange, className = '' }) {
  return (
    <label className={`checkbox ${className}`.trim()}>
      <input
        type="checkbox"
        name={name}
        checked={!!checked}
        onChange={(e) => {
          if (!onChange) return;
          // Semantic Form.Checkbox style: (e, { name }) — parent toggles
          onChange(e, { name, checked: e.target.checked, value: e.target.checked });
        }}
      />
      <span>{label}</span>
    </label>
  );
}

Checkbox.propTypes = {
  label: PropTypes.node,
  name: PropTypes.string,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <span>{label}</span>
      <input type="checkbox" checked={!!checked} onChange={onChange} />
      <span className="toggle__track" aria-hidden="true" />
    </label>
  );
}

Toggle.propTypes = {
  label: PropTypes.node,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
};

export function Alert({ tone = 'info', title, children, content }) {
  const body = content ?? children;
  if (!body && !title) return null;
  return (
    <div className={`alert alert--${tone}`} role="alert">
      {title ? <div className="alert__title">{title}</div> : null}
      {body ? <div>{body}</div> : null}
    </div>
  );
}

Alert.propTypes = {
  tone: PropTypes.oneOf(['error', 'success', 'warn', 'info']),
  title: PropTypes.node,
  children: PropTypes.node,
  content: PropTypes.node,
};

export function Panel({ title, meta, children, footer, className = '' }) {
  return (
    <section className={`panel ${className}`.trim()}>
      {(title || meta) && (
        <header className="panel__header">
          {title ? <h2 className="panel__title">{title}</h2> : null}
          {meta ? <p className="panel__meta">{meta}</p> : null}
        </header>
      )}
      <div className="panel__body">{children}</div>
      {footer ? <footer className="panel__footer">{footer}</footer> : null}
    </section>
  );
}

Panel.propTypes = {
  title: PropTypes.node,
  meta: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export function ConfirmDialog({ open, title, content, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? <h3>{title}</h3> : null}
        <p>{content || 'Are you sure?'}</p>
        <div className="modal__actions">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
}

ConfirmDialog.propTypes = {
  open: PropTypes.bool,
  title: PropTypes.node,
  content: PropTypes.node,
  onCancel: PropTypes.func,
  onConfirm: PropTypes.func,
};

export function BrandMark({ logoUrl, alt = '' }) {
  if (logoUrl) {
    return (
      <span className="brand__mark brand__mark--logo">
        <img src={logoUrl} alt={alt} />
      </span>
    );
  }
  return (
    <span className="brand__mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.5l7.5 3v5.2c0 4.8-3.1 9.1-7.5 10.8C7.6 19.8 4.5 15.5 4.5 10.7V5.5L12 2.5zm0 2.2L6.5 6.7v4c0 3.7 2.3 7 5.5 8.4 3.2-1.4 5.5-4.7 5.5-8.4v-4L12 4.7z" />
      </svg>
    </span>
  );
}

BrandMark.propTypes = {
  logoUrl: PropTypes.string,
  alt: PropTypes.string,
};

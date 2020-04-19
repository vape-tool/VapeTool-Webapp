import React, { ReactElement, ReactNode } from 'react';
import { FormattedMessage } from 'umi-plugin-react/locale';

export const i18nValidationRequired = (name: ReactNode): ReactElement => (
  <FormattedMessage id="misc.validation.required" defaultMessage="Please input this field!">
    {txt => `${txt} ${name}!`}
  </FormattedMessage>
);

import { RuleConfigSeverity, UserConfig } from '@commitlint/types';

const Config: UserConfig = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    'type-enum': [
      RuleConfigSeverity.Error,
      'always',
      ['feat', 'chore', 'docs', 'fix', 'build', 'refactor'],
    ],
  },
};

export default Config;

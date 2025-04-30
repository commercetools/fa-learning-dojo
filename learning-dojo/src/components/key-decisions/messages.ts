import { defineMessages } from 'react-intl';

const messages = defineMessages({
    headline: {
      id: 'Welcome.QuickStartGuideStep.End.headline',
      description: 'Step header',
      defaultMessage: 'Nicely done! You’ve got the essentials down.',
    },
    content: {
      id: 'Welcome.QuickStartGuideStep.End.content',
      description: 'Message text',
      defaultMessage:
        'Keep learning by visiting <link>Learn commercetools</link> or talking to one of our experts. We are happy to help!',
    },
    buttonLabel: {
      id: 'Welcome.QuickStartGuideStep.End.buttonLabel',
      description: 'The button label',
      defaultMessage: 'Contact us',
    },
    buttonTooltipText: {
      id: 'Welcome.QuickStartGuideStep.buttonTooltipText',
      description: 'Incomplete step button tooltip text',
      defaultMessage: 'Finish the previous step before you proceed.',
    },
    buttonTooltipCollapse: {
      id: 'Welcome.QuickStartGuide.buttonTooltipCollapse',
      description: 'Collapses the quick start guide',
      defaultMessage: 'Minimize',
    },
    buttonTooltipExpand: {
      id: 'Welcome.QuickStartGuide.buttonTooltipExpand',
      description: 'Expands the quick start guide',
      defaultMessage: 'Expand',
    },
  });
  
  export default messages;
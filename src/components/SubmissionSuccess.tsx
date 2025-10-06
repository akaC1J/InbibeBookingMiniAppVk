import { FC } from 'react';
import { Group, Header, Footnote, Spacing, Button } from '@vkontakte/vkui';
import { Icon24CheckCircleOutline } from '@vkontakte/icons';

export interface SubmissionSuccessProps {
  onBack: () => void;
}

/**
 * Reusable success state block shown after successful submission.
 */
export const SubmissionSuccess: FC<SubmissionSuccessProps> = ({ onBack }) => {
  return (
    <Group
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        gap: 12,
      }}
    >
      <Icon24CheckCircleOutline width={64} height={64} color="var(--vkui--color_icon_positive)" />
      <Header size="m">Заявка успешно отправлена!</Header>
      <Footnote style={{ color: 'var(--vkui--color_text_secondary)' }}>
        Ожидайте звонка менеджера для подтверждения брони.
      </Footnote>

      <Spacing size={16} />

      <Button mode="secondary" size="l" onClick={onBack}>
        Вернуться
      </Button>
    </Group>
  );
};

export default SubmissionSuccess;

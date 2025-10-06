import {FC} from 'react';
import {Button, FormItem, Input} from '@vkontakte/vkui';

export interface GuestsCounterProps {
    value: number,
    onChange: (value: number) => void,
    min?: number,
    max?: number,
    guestsValid?: boolean
}

/**
 * Reusable guests counter with +/- controls and numeric input.
 */
export const GuestsCounterField: FC<GuestsCounterProps> = ({value, onChange, min = 1, max = 20, guestsValid}) => {
    const clamp = (n: number) => Math.max(min, Math.min(max, Math.floor(n)));

    return (
        <FormItem top="Количество гостей" bottom="От 1 до 20 человек" status={guestsValid ? 'valid' : 'error'}>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <Button size="l" mode="secondary" onClick={() => onChange(clamp(value - 1))} aria-label="Уменьшить">
                    −
                </Button>
                <Input
                    type="number"
                    value={String(value)}
                    onChange={(e) => onChange(clamp(Number((e.target as HTMLInputElement).value || 0)))}
                    min={min}
                    max={max}
                    style={{textAlign: 'center'}}
                    aria-label="Количество гостей"
                />
                <Button size="l" mode="secondary" onClick={() => onChange(clamp(value + 1))} aria-label="Увеличить">
                    +
                </Button>
            </div>
        </FormItem>
    );
};

export default GuestsCounterField;

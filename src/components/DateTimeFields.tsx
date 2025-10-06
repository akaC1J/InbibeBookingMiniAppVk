import { FC, useMemo, useState } from 'react';
import {
    FormItem,
    DateInput,
    SegmentedControl,
    SegmentedControlValue,
    Select,
} from '@vkontakte/vkui';

export interface DateTimeFieldsProps {
    date: Date | null;
    onDateChange: (value: Date | null) => void;
    minDateTime?: Date;
    dateValid: boolean;
    time: string;
    onTimeChange: (value: string) => void;
    timeValid: boolean;
}

/** Date + time fields with day/night toggle and 15-minute step */
export const DateTimeFields: FC<DateTimeFieldsProps> = ({
                                                            date,
                                                            onDateChange,
                                                            minDateTime,
                                                            dateValid,
                                                            time,
                                                            onTimeChange,
                                                            timeValid,
                                                        }) => {
    const [period, setPeriod] = useState<'night' | 'day'>('day');

    // 0 — воскресенье, 6 — суббота
    const dayOfWeek = date?.getDay();
    const nightClose = dayOfWeek === 0 || dayOfWeek === 6 ? '05:00' : '03:00';

    /** Генерация списка времён каждые 15 минут */
    const buildOptions = (minHour: number, maxHour: number) => {
        const result: { label: string; value: string }[] = [];
        if (maxHour == 23) {
            maxHour = maxHour + 1
        }
        for (let h = minHour; h < maxHour; h++) {
            for (let m = 0; m < 60; m += 15) {
                const hh = h.toString().padStart(2, '0');
                const mm = m.toString().padStart(2, '0');
                const value = `${hh}:${mm}`;
                result.push({ label: value, value });
            }
        }
        return result;
    };

    const ranges = useMemo(
        () => ({
            night: {
                label: 'Ночь 🌙',
                hint: `Бар работает с 00:00 до ${nightClose}`,
                options: buildOptions(0, parseInt(nightClose.split(':')[0], 10)),
            },
            day: {
                label: 'Вечер 🌅',
                hint: 'Бар работает с 15:00 до 23:59',
                options: buildOptions(15, 23),
            },
        }),
        [nightClose],
    );

    const handlePeriodChange = (value: SegmentedControlValue) => {
        if (value === 'night' || value === 'day') {
            setPeriod(value);
            onTimeChange('');
        }
    };

    return (
        <>
            {/* --- Дата --- */}
            <FormItem top="Дата бронирования" status={dateValid ? 'valid' : 'default'}>
                <DateInput
                    value={date}
                    onChange={(v) => onDateChange(v ?? null)}
                    minDateTime={minDateTime}
                    disablePast
                />
            </FormItem>

            {/* --- Переключатель времени суток --- */}
            <FormItem top="Выберите время суток">
                <SegmentedControl
                    size="m"
                    value={period}
                    onChange={handlePeriodChange}
                    options={[
                        { label: `🌙 00:00–${nightClose}`, value: 'night' as const },
                        { label: '🌅 15:00–23:59 (следующая смена)', value: 'day' as const },
                    ]}
                />
            </FormItem>

            {/* --- Время --- */}
            <FormItem
                top={`Время бронирования (${ranges[period].label})`}
                status={time ? (timeValid ? 'valid' : 'error') : 'default'}
                bottom={
                    !timeValid && time
                        ? 'Введите время в формате ЧЧ:ММ'
                        : ranges[period].hint
                }
            >
                <Select
                    placeholder="--:--"
                    options={ranges[period].options}
                    value={time || null}
                    onChange={(_, newValue) => onTimeChange(String(newValue ?? ''))}
                />
            </FormItem>
        </>
    );
};

export default DateTimeFields;

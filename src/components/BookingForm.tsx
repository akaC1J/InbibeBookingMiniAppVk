import {FC} from 'react';
import {Group, Header, Spacing, Button, Footnote, Separator, Spinner} from '@vkontakte/vkui';
import {Icon16Done} from '@vkontakte/icons';
import {ContactFields} from './ContactFields';
import {DateTimeFields} from './DateTimeFields';
import {GuestsCounterField} from './GuestsCounterField';

export interface BookingFormProps {
    name: string,
    onNameChange: (v: string) => void,
    nameValid: boolean,
    phone: string,
    onPhoneChange: (v: string) => void,
    phoneValid: boolean,
    onRequestPhone?: () => void,
    date: Date | null,
    onDateChange: (d: Date | null) => void,
    minDateTime: Date,
    dateValid: boolean,
    time: string,
    onTimeChange: (t: string) => void,
    timeValid: boolean,
    guests: number,
    onGuestsChange: (n: number) => void,
    guestsValid: boolean,
    isFormValid: boolean,
    onSubmit: () => void,
    isSubmitting?: boolean
}

export const BookingForm: FC<BookingFormProps> = ({
                                                      name,
                                                      onNameChange,
                                                      nameValid,
                                                      phone,
                                                      onPhoneChange,
                                                      phoneValid,
                                                      onRequestPhone,
                                                      date,
                                                      onDateChange,
                                                      minDateTime,
                                                      dateValid,
                                                      time,
                                                      onTimeChange,
                                                      timeValid,
                                                      guests,
                                                      onGuestsChange,
                                                      guestsValid,
                                                      isFormValid,
                                                      onSubmit,
                                                      isSubmitting
                                                  }) => {
    return (
        <Group
            style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
            }}
            header={<Header size="m">Данные для бронирования</Header>}
        >
            <ContactFields
                name={name}
                onNameChange={onNameChange}
                nameValid={nameValid}
                phone={phone}
                onPhoneChange={onPhoneChange}
                phoneValid={phoneValid}
                onRequestPhone={onRequestPhone}
            />

            <DateTimeFields
                date={date}
                onDateChange={onDateChange}
                minDateTime={minDateTime}
                dateValid={dateValid}
                time={time}
                onTimeChange={onTimeChange}
                timeValid={timeValid}
            />

            <GuestsCounterField
                value={guests}
                onChange={onGuestsChange}
                min={1}
                max={20}
                guestsValid={guestsValid}
            />

            <Spacing size={8}/>
            <Button
                size="l"
                appearance="accent"
                onClick={onSubmit}
                disabled={!isFormValid || isSubmitting}
                before={
                    isSubmitting ? (
                        <Spinner size="s" />
                    ) : (
                        <Icon16Done />
                    )
                }
                style={{
                    alignSelf: "center",
                    width: "auto",
                    opacity: isSubmitting ? 0.8 : 1,
                    transition: "opacity 0.2s ease",
                }}
            >
                {isSubmitting ? "Отправляем..." : "Забронировать"}
            </Button>
            <Spacing size={4}/>
            <Separator appearance="primary"/>
            <Footnote
                style={{
                    color: 'var(--vkui--color_text_secondary)',
                    textAlign: 'center',
                }}
            >
                💬 Убедитесь, что разрешены сообщения от сообщества, чтобы мы могли
                отправить подтверждение бронирования.
            </Footnote>
        </Group>
    );
};

export default BookingForm;

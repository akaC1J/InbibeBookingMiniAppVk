import {FC, useEffect, useMemo, useState} from 'react';
import {
    Panel,
    PanelHeader,
    NavIdProps,
    Snackbar,
} from '@vkontakte/vkui';
import {Icon16ErrorCircleFill, Icon24CheckCircleOutline, Icon24Phone} from '@vkontakte/icons';
import bridge, {UserInfo} from '@vkontakte/vk-bridge';
import { SubmissionSuccess } from '../components/SubmissionSuccess';
import { BookingForm } from '../components/BookingForm';
import { unionDateAndTime } from '../utils/booking';
import {BookingRequest, sendBooking} from "../utils/fetchings.ts";

const GROUP_ID = Number(import.meta.env.VITE_GROUP_ID)

export interface HomeProps extends NavIdProps {
    go: (panelName: string) => void;
    fetchedUser?: UserInfo;
}



export const Home: FC<HomeProps> = ({id, fetchedUser}) => {
    const first_name = fetchedUser?.first_name
    const user_id = fetchedUser?.id

    const [name, setName] = useState<string>(first_name ? `${first_name}` : '');
    const [phone, setPhone] = useState<string>('');
    const today = useMemo(() => new Date(), []);
    const [date, setDate] = useState<Date | null>(new Date());
    const [time, setTime] = useState<string>('19:00');
    const [guests, setGuests] = useState<number>(2);
    const [snackbar, setSnackbar] = useState<React.ReactNode | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);


    useEffect(() => {
        if (fetchedUser?.first_name) {
            setName(fetchedUser.first_name);
        }
    }, [fetchedUser]);


    const phoneValid = useMemo(() => /^\+?\d[\d\s\-()]{8,}$/.test(phone.trim()), [phone]);
    const nameValid = useMemo(() => name.trim().length >= 2, [name]);
    const dateValid = useMemo(() => date instanceof Date && !isNaN(date.getTime()), [date]);
    const timeValid = useMemo(() => /^([01]?\d|2[0-3]):[0-5]\d$/.test(time), [time]);
    const guestsValid = useMemo(() => guests >= 1 && guests <= 20, [guests]);

    const isFormValid = nameValid && phoneValid && dateValid && timeValid && guestsValid;

    const showSnackbar = (message: string, icon: React.ReactNode) => {
        setSnackbar(
            <Snackbar onClose={() => setSnackbar(null)} before={icon}>
                {message}
            </Snackbar>
        );
    };

    const requestPhoneNumber = async () => {
        interface VKPhoneNumberResponse {
            phone_number?: string;
            sign?: string;
        }

        try {
            const result = await bridge.send('VKWebAppGetPhoneNumber') as VKPhoneNumberResponse;
            if (result.phone_number) {
                setPhone("+" + result.phone_number);
                showSnackbar('Номер успешно получен ✅', <Icon24Phone />);
            } else {
                showSnackbar('Не удалось получить номер', <Icon16ErrorCircleFill color="var(--vkui--color_icon_negative)" />);
            }
        } catch (e) {
            console.warn('Ошибка при запросе номера телефона:', e);
            showSnackbar('Не удалось получить номер', <Icon16ErrorCircleFill color="var(--vkui--color_icon_negative)" />);
        }
    };

    const onSubmit = async () => {
        if (!isFormValid) {
            showSnackbar(
                "Проверьте корректность полей",
                <Icon16ErrorCircleFill color="var(--vkui--color_icon_negative)" />
            );
            return;
        }

        setIsSubmitting(true);
        try {
            console.log(GROUP_ID)
            // Разрешение на отправку сообщений
             const data = await bridge.send("VKWebAppAllowMessagesFromGroup", {
                group_id: GROUP_ID,
            });
             console.log(data)
        } catch (e) {
            console.warn("Пользователь не дал разрешение на сообщения", e);
        }

        // Формируем объект заявки
        const booking: BookingRequest = {
            user_id: user_id,
            name,
            phone,
            date_time: unionDateAndTime(date!, time),
            guests: Number(guests),
        };

        try {
            const result = await sendBooking(booking);
            console.log("Ответ сервера:", result);

            showSnackbar("Заявка отправлена!", <Icon24CheckCircleOutline />);
            setIsSubmitted(true);

        } catch (error) {
            console.error("Ошибка при отправке:", error);
            showSnackbar(
                "Не удалось отправить заявку. Попробуйте позже.",
                <Icon16ErrorCircleFill color="var(--vkui--color_icon_negative)" />
            );
        }    };


    return (
        <Panel id={id}>
            <PanelHeader>INBIBE • Бронь стола</PanelHeader>

            {isSubmitted ? (
                <SubmissionSuccess onBack={() => {
                    setIsSubmitted(false)
                    setIsSubmitting(false)
                }} />
            ) : (
                // 🧾 Основная форма бронирования
                <BookingForm
                    name={name}
                    onNameChange={setName}
                    nameValid={nameValid}
                    phone={phone}
                    onPhoneChange={setPhone}
                    phoneValid={phoneValid}
                    onRequestPhone={requestPhoneNumber}
                    date={date}
                    onDateChange={setDate}
                    minDateTime={today}
                    dateValid={dateValid}
                    time={time}
                    onTimeChange={setTime}
                    timeValid={timeValid}
                    guests={guests}
                    onGuestsChange={setGuests}
                    guestsValid={guestsValid}
                    onSubmit={onSubmit}
                    isSubmitting={isSubmitting}
                />
            )}

            {snackbar}
        </Panel>
    );
};
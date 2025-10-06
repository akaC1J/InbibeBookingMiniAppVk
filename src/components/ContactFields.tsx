import {FC} from 'react';
import {FormItem, Input, Button} from '@vkontakte/vkui';

export interface ContactFieldsProps {
    name: string;
    onNameChange: (value: string) => void;
    nameValid: boolean;
    phone: string;
    onPhoneChange: (value: string) => void;
    phoneValid: boolean;
    onRequestPhone?: () => void;
}

/**
 * Combined Name and Phone fields with validation hints.
 * Keeps UI consistent and reusable across panels.
 */
export const ContactFields: FC<ContactFieldsProps> = ({
                                                          name,
                                                          onNameChange,
                                                          nameValid,
                                                          phone,
                                                          onPhoneChange,
                                                          phoneValid, onRequestPhone
                                                      }) => {
    return (
        <>
            <FormItem
                top="Имя"
                status={name ? (nameValid ? 'valid' : 'error') : 'default'}
                bottom={!nameValid && name ? 'Минимум 2 символа' : undefined}
            >
                <Input
                    value={name}
                    onChange={(e) => onNameChange((e.target as HTMLInputElement).value)}
                    placeholder="Как к вам обращаться"
                    maxLength={64}
                    aria-label="Имя"
                />
            </FormItem>

            <FormItem
                top="Телефон"
                status={phone ? (phoneValid ? 'valid' : 'error') : 'default'}
                bottom={!phoneValid && phone ? 'Введите номер в формате +7 999 123-45-67' : ''}
            >
                <Input
                    value={phone}
                    onChange={(e) => onPhoneChange((e.target as HTMLInputElement).value)}
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 999 123-45-67"
                    aria-label="Телефон"
                />

                <Button
                    mode="secondary"
                    size="m"
                    onClick={onRequestPhone}
                    style={{ marginTop: 8 }}
                >
                    Поделиться номером
                </Button>
            </FormItem>
        </>
    );
};

export default ContactFields;

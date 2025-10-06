const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface BookingResponse {
    success: boolean;
    error?: string | null;
}

export interface BookingRequest {
    user_id?: number
    name: string
    phone: string
    date_time: Date
    guests: number
}


export const sendBooking = async (booking: BookingRequest): Promise<BookingResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(booking),
    });

    if (response.status != 200) {
        throw new Error(`Ошибка: ${response.status}`);
    }

    return await response.json();
};

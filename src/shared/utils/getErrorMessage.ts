export const getErrorMessage = (e: unknown) => {
    if (e instanceof Error) return e.message;
    else if (e && typeof e === "object" && "message" in e) return String((e as { message: unknown }).message);
    return "Nezināmā kļūda";
}
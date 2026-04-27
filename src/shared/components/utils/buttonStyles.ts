export type ButtonVariant = "primary" | "outline" | "success";

export const buttonStyles = (variant: ButtonVariant): string => {
    if (variant === "primary") return "text-white text-lg md:text-xl font-semibold bg-primary p-3 rounded w-2/3 max-w-[200px] text-center";
    else if (variant === "outline") return "text-primary border p-3 rounded text-lg md:text-xl w-2/3 max-w-[200px] text-center";
    else return "bg-green-700 text-white px-10 py-5 rounded text-lg md:text-xl font-semibold w-2/3 max-w-[200px] text-center";
}
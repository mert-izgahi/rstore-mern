import { Image as ImageIcon, Loader2 } from "lucide-react";
import { useRef } from "react";
import { useUploadStorage } from "@/hooks/use-upload-storage";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";
interface AvatarInputProps {
    value: string | null;
    onChange: (value: string) => void;
    className?: string;
}

function AvatarInput({ value, onChange, className }: AvatarInputProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { isPending, uploadStorage } = useUploadStorage();
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            const formData = new FormData();
            formData.append("file", file);
            try {
                const data = await uploadStorage(formData);
                if (data?.url) {
                    onChange(data.url);
                }
            } catch (error) {
                console.log(error);
            }
        }
    };



    return (
        <>
            <input type="file" multiple hidden accept="image/*" ref={ref} onChange={onFileChange} />
            <Avatar className={cn(className, "cursor-pointer w-24 h-24")} onClick={() => ref.current?.click()}>
                <AvatarImage src={value!} className="object-cover" />
                <AvatarFallback>
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                </AvatarFallback>
            </Avatar>
        </>

    )
}

export default AvatarInput
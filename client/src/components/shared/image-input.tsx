import { Image as ImageIcon, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useRef } from "react";
import { useUploadStorage } from "@/hooks/use-upload-storage";
interface ImageInputProps {
    value: string[];
    onChange: (value: string[]) => void;
    className?: string;
}

function ImageInput({ value, onChange, className }: ImageInputProps) {
    const ref = useRef<HTMLInputElement>(null);
    const { isPending, uploadStorage } = useUploadStorage();
    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const newImageUrls: string[] = [];
            const formDataArray = Array.from(files).map((file) => {
                const formData = new FormData();
                formData.append("file", file);
                return formData;
            });

            for (const formData of formDataArray) {
                try {
                    const data = await uploadStorage(formData);
                    if (data?.url) {
                        newImageUrls.push(data.url);
                    }
                } catch (error) {
                    console.log(error);
                }
            }

            // Preserve existing images while adding new ones
            onChange([...value, ...newImageUrls]);
        }
    };



    return (
        <div className="flex flex-col gap-4">
            <div className="w-full flex flex-row flex-wrap gap-2">
                <input type="file" multiple hidden accept="image/*" ref={ref} onChange={onFileChange} />
                {
                    value.length > 0 && (
                        value.map((url, index) => (
                            <div key={index} className="relative w-[300px] h-[300px]">
                                <img src={url} alt="" className="w-full h-full object-cover" />
                                <Button type="button" className="absolute top-2 right-2" size={"icon"} onClick={() => onChange(value.filter((_, i) => i !== index))}>
                                    <Trash className="w-4 h-4" />
                                </Button>
                            </div>
                        ))
                    )
                }

                <div className="w-[300px] h-[300px] border border-dashed border-border flex items-center justify-center">
                    <Button type="button" variant="outline" className={className} onClick={() => ref.current?.click()} disabled={isPending}>
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload an image
                    </Button>
                </div>
            </div>

        </div>

    )
}

export default ImageInput
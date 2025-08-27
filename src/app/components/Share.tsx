import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { RWebShare } from "react-web-share";
interface RShareProps {
    url: string;
    title: string;
    text: string;
}

export const ShareButton: React.FC<RShareProps> = ({ url, title, text }) => {
    return (
        <RWebShare data={{
            url,
            title,
            text,
        }} onClick={() => {
            toast.success('Shared successfully');
        }}>
            <Button size="sm" variant='outline'>
                <Share2 className="h-4 w-4 mr-2">Share</Share2>
            </Button>
        </RWebShare>
    )
}

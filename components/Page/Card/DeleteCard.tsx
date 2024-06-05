import { deleteCardAPI } from "@/api/card";
import { ListCardResponse } from "@/types/card.type";
import { Button } from "@mui/material";
import { RefetchOptions, QueryObserverResult, useMutation } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export default function DeleteCard({ id, refetch, setIsPending, disable }: { id: string, refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<AxiosResponse<ListCardResponse, any>, Error>>, setIsPending: (isPending: boolean) => void, disable: boolean }) {

    const deleteCardMutation = useMutation({
        mutationKey: ["/cards"],
        mutationFn: (cardId: string) => deleteCardAPI(cardId),
        onMutate: () => {
            setIsPending(true);
        }
    });

    const onDelete = async () => {
        try {
            await deleteCardMutation.mutateAsync(id, {
                onSuccess: () => {
                    toast.success('Card deleted successfully');
                    refetch();
                    setIsPending(false);
                },
                onError: () => {
                    toast.error('Failed to delete card');
                    setIsPending(false);
                    refetch();
                }
            });
        } catch (error) {
            toast.error('Failed to delete card');
            setIsPending(false);
            refetch();
        }
    }

    return (
        <>
            <Button
                sx={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    width: '80px',
                    '&:disabled': {
                        backgroundColor: 'grey',
                        color: 'white',
                    },
                    '&:hover': {
                        backgroundColor: '#dc2626',
                    }
                }}
                disabled={disable}
                onClick={onDelete}
            >
                Delete
            </Button>
        </>
    );
}
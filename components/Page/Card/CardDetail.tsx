import Modal from "@/components/modal/modal";
import { CardProps } from "@/types/card.type";
import CloseIcon from "@mui/icons-material/Close";

export default function CardDetail({
  isOpen,
  setIsOpen,
  CardProps,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  CardProps: CardProps | null;
}) {
  const handleClose = () => {
    setIsOpen(false);
  };
  return (
    <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
      <div className="pl-5 pr-5 pt-5 pb-5 flex flex-col">
        <div className="flex justify-end">
          <CloseIcon onClick={handleClose} className="cursor-pointer" />
        </div>
        <div className="flex flex-row">
          <div className="flex flex-col justify-between mt-5">
            <div>
              <p className="text-lg font-bold text-center">Card Detail</p>
            </div>
            <div>
              <div>
                <p className="text-lg font-bold">Card ID:</p>
                <p>{CardProps?.id}</p>
              </div>
              <div>
                <p className="text-lg font-bold">Card Number:</p>
                <p>{CardProps?.cardNumber}</p>
              </div>
              <div>
                <p className="text-lg font-bold">Card Plate Number:</p>
                <p>
                  {CardProps?.plateNumber?.trim() === ""
                    ? "None"
                    : CardProps?.plateNumber?.trim()}
                </p>
              </div>
              <div>
                <p className="text-lg font-bold">Created Date:</p>
                <p>{CardProps?.createdDate}</p>
              </div>
              <div>
                <p className="text-lg font-bold">Card Status:</p>
                <p>{CardProps?.status}</p>
              </div>
              <div>
                <p className="text-lg font-bold">Is In Use:</p>
                <p>{CardProps?.isInUse ? "In use" : "Not in use"}</p>
              </div>
            </div>
          </div>
          {CardProps?.isInUse && (
            <>
              <div className="vertical-line border ml-5 mr-5"></div>
              <div className="flex flex-col justify-between mt-5">
                <div>
                  <p className="text-lg text-center font-bold">
                    Card Session Detail
                  </p>
                </div>
                <div>
                  <div>
                    <p className="text-lg font-bold">Session ID:</p>
                    <p>{CardProps?.session?.sessionId}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">GateIn:</p>
                    <p>{CardProps?.session?.gateIn}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">PlateNumber:</p>
                    <p>{CardProps?.session?.plateNumber}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">Time in:</p>
                    <p>{CardProps?.session?.timeIn}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">Vehicle Type:</p>
                    <p>{CardProps?.session?.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">Customer Email:</p>
                    <p>{CardProps?.session?.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">Staff Check In Email:</p>
                    <p>{CardProps?.session?.staffCheckInEmail}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

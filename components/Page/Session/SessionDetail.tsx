import { getSessionAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
const Button = dynamic(() => import("@mui/material/Button"));
import { useQuery } from "@tanstack/react-query";
const Image = dynamic(() => import("next/image"));
const ButtonCheckOut = dynamic(() => import("./ButtonCheckOut"));
import { useEffect, useState } from "react";
import toLocaleDate, { getLocalISOString, toVNDateString } from "@/utils/date";
import Loading from "../LoadingPage/Loading";
import ButtonCancelSession from "./ButtonCancelSession";
import dynamic from "next/dynamic";
import logo from "@/public/Bai_Logo.svg";
import CloseIcon from "@mui/icons-material/Close";

export default function SessionDetail({
  isOpen,
  setIsOpen,
  sessionId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  sessionId: string | null;
}) {
  const handleClose = () => {
    setIsOpen(false);
  };
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalCancel, setIsOpenModalCancel] = useState(false);

  const { data, isLoading, isError, isSuccess, error, refetch } = useQuery({
    queryKey: ["/session/detail", sessionId],
    queryFn: () => getSessionAPI(sessionId as string),
    retry: 1,
    enabled: !!sessionId,
    staleTime: 0,
  });

  const statusSession = data?.data.data?.status;

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen]);

  return (
    <Modal onClose={handleClose} open={isOpen} setOpen={setIsOpen}>
      {sessionId ? (
        <div className="pl-5 pr-5 pt-10 pb-10">
          <Button
            sx={{
              position: "absolute",
              padding: "0",
              margin: "10px",
              width: "0",
              right: "0",
              top: "0",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
            className="cursor-pointer"
            onClick={handleClose}
            color="error"
          >
            <CloseIcon />
          </Button>
          {isLoading && <Loading />}
          {isError && <p>Server Error</p>}
          {isSuccess && (
            <>
              <div className="p-4 flex flex-row gap-5 min-h-fit">
                <div className="mb-4">
                  <p className="text-xl font-bold mb-2">Session Detail</p>
                  <p>
                    <strong>Session ID:</strong> {data?.data.data?.id}
                  </p>
                  <p>
                    <strong>Parking Location:</strong>{" "}
                    {data?.data.data?.parkingArea}
                  </p>
                  <p>
                    <strong>Gate In:</strong> {data?.data.data?.gateInName}
                  </p>
                  <p>
                    <strong>Gate Out:</strong> {data?.data.data?.gateOutName}
                  </p>
                  <p>
                    <strong>Plate Number:</strong>{" "}
                    {data?.data.data?.plateNumber}
                  </p>
                  <p>
                    <strong>Check In Staff:</strong>{" "}
                    {data?.data.data?.checkInStaff}
                  </p>
                  <p>
                    <strong>Check Out Staff:</strong>{" "}
                    {data?.data.data?.checkOutStaff}
                  </p>
                  <p>
                    <strong>Time In:</strong>{" "}
                    {toLocaleDate(data?.data.data?.timeIn ?? "") ?? ""}
                  </p>
                  <p>
                    <strong>Time Out:</strong>{" "}
                    {toVNDateString(data?.data.data?.timeOut ?? "") ?? "NaN"}
                  </p>

                  <p>
                    <strong>Vehicle Type:</strong>{" "}
                    {data?.data.data?.vehicleTypeName}
                  </p>
                  <p>
                    <strong>Payment Method:</strong>{" "}
                    {data?.data.data?.paymentMethodName}
                  </p>
                  <p>
                    <strong>Customer Email:</strong>{" "}
                    {data?.data.data?.customerEmail}
                  </p>
                  <p>
                    <strong>Status:</strong> {data?.data.data?.status}
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="font-semibold mb-2">Image In:</p>
                    {data?.data.data?.imageInUrl && (
                      <Image
                        loader={() => data?.data.data?.imageInUrl as string}
                        src={(data?.data.data?.imageInUrl as string) ?? logo}
                        alt="session image in"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Image Out:</p>
                    {data?.data.data?.imageOutUrl && (
                      <Image
                        loader={() => data?.data.data?.imageOutUrl as string}
                        src={data?.data.data?.imageOutUrl as string}
                        alt="session image out"
                        width={200}
                        height={200}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="w-full justify-center items-center flex gap-5">
                {statusSession === "PARKED" && (
                  <>
                    <ButtonCheckOut
                      plateNumber={data?.data.data?.plateNumber as string}
                      checkOutTime={getLocalISOString(new Date())}
                      setIsOpen={setIsOpenModal}
                      isOpen={isOpenModal}
                      cardNumber={data?.data.data?.cardNumber as string}
                    />
                    <ButtonCancelSession
                      sessionId={data?.data.data?.id as string}
                      setIsOpen={setIsOpenModalCancel}
                      isOpen={isOpenModalCancel}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="pl-5 pr-5 pt-10 pb-10">
          <Button
            onClick={handleClose}
            sx={{
              position: "absolute",
              padding: "0",
              margin: "10px",
              width: "0",
              right: "0",
              top: "0",
              color: "black",
              border: "1px solid black",
              backgroundColor: "white",
              "&:hover": {
                backgroundColor: "white",
              },
            }}
          >
            X
          </Button>
          <p>No session selected</p>
        </div>
      )}
    </Modal>
  );
}

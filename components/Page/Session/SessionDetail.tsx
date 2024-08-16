import { getSessionAPI } from "@/api/session";
import Modal from "@/components/modal/modal";
import { Button } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import ButtonCheckOut from "./ButtonCheckOut";
import { use, useEffect, useState } from "react";
import { getLocalISOString } from "@/utils/date";
import Loading from "../LoadingPage/Loading";
import ButtonCancelSession from "./ButtonCancelSession";

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
          {isLoading && <Loading />}
          {isError && <p>Server Error</p>}
          {isSuccess && (
            <>
              <div className="p-4 flex flex-row gap-5">
                <div className="mb-4">
                  <p className="text-xl font-bold mb-2">Session Detail</p>
                  <p>
                    <strong>Session ID:</strong> {data?.data.data?.id}
                  </p>
                  <p>
                    <strong>Session Card:</strong> {data?.data.data?.cardNumber}
                  </p>
                  <p>
                    <strong>Session Mode:</strong> {data?.data.data?.mode}
                  </p>
                  <p>
                    <strong>Session Gate Out:</strong>{" "}
                    {data?.data.data?.gateOutName}
                  </p>
                  <p>
                    <strong>Session Gate In:</strong>{" "}
                    {data?.data.data?.gateInName}
                  </p>
                  <p>
                    <strong>Session Plate Number:</strong>{" "}
                    {data?.data.data?.plateNumber}
                  </p>
                  <p>
                    <strong>Session Check In Staff:</strong>{" "}
                    {data?.data.data?.checkInStaff}
                  </p>
                  <p>
                    <strong>Session Check Out Staff:</strong>{" "}
                    {data?.data.data?.checkOutStaff}
                  </p>
                  <p>
                    <strong>Session Time In:</strong> {data?.data.data?.timeIn}
                  </p>
                  <p>
                    <strong>Session Time Out:</strong>{" "}
                    {data?.data.data?.timeOut ?? "null"}
                  </p>
                  <p>
                    <strong>Session Vehicle Type:</strong>{" "}
                    {data?.data.data?.vehicleTypeName}
                  </p>
                  <p>
                    <strong>Session Payment Method:</strong>{" "}
                    {data?.data.data?.paymentMethodName}
                  </p>
                  <p>
                    <strong>Session Customer Email:</strong>{" "}
                    {data?.data.data?.customerEmail}
                  </p>
                  <p>
                    <strong>Session Status:</strong> {data?.data.data?.status}
                  </p>
                  <p>
                    <strong>Session Parking Location:</strong>{" "}
                    {data?.data.data?.parkingArea}
                  </p>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <p className="font-semibold mb-2">Session Image In:</p>
                    <Image
                      loader={() => data?.data.data?.imageInUrl as string}
                      src={data?.data.data?.imageInUrl as string}
                      alt="session image in"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="font-semibold mb-2">Session Image Out:</p>
                    <Image
                      loader={() => data?.data.data?.imageOutUrl as string}
                      src={data?.data.data?.imageOutUrl as string}
                      alt="session image out"
                      width={200}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full justify-center items-center flex gap-5">
                {statusSession === "PARKED" && (
                  <>
                    <ButtonCheckOut
                      plateNumber={data?.data.data?.plateNumber as string}
                      timeOut={getLocalISOString(new Date())}
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

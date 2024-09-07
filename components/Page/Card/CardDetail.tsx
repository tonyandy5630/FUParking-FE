import Modal from "@/components/modal/modal";
import { CardProps } from "@/types/card.type";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Typography, Divider, IconButton } from "@mui/material";

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
      <Box p={3} display="flex" flexDirection="column" position="relative">
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Box display="flex" flexDirection="row">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            mt={1}
          >
            <Typography variant="h6" align="center" fontWeight="bold">
              Card Detail
            </Typography>
            <Box mt={1}>
              <Typography variant="subtitle1" fontWeight="bold">
                Card ID:
              </Typography>
              <Typography>{CardProps?.id}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Card Number:
              </Typography>
              <Typography>{CardProps?.cardNumber}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Created Date:
              </Typography>
              <Typography>{CardProps?.createdDate}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Card Status:
              </Typography>
              <Typography>{CardProps?.status}</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Is In Use:
              </Typography>
              <Typography>
                {CardProps?.isInUse ? "In use" : "Not in use"}
              </Typography>
            </Box>
          </Box>
          {CardProps?.isInUse && (
            <>
              <Divider orientation="vertical" flexItem sx={{ mx: 5 }} />
              <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                mt={1}
              >
                <Typography variant="h6" align="center" fontWeight="bold">
                  Card Session Detail
                </Typography>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Session ID:
                  </Typography>
                  <Typography>{CardProps?.session?.sessionId}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    GateIn:
                  </Typography>
                  <Typography>{CardProps?.session?.gateIn}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    PlateNumber:
                  </Typography>
                  <Typography>{CardProps?.session?.plateNumber}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Time in:
                  </Typography>
                  <Typography>{CardProps?.session?.timeIn}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Vehicle Type:
                  </Typography>
                  <Typography>{CardProps?.session?.vehicleType}</Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Customer Email:
                  </Typography>
                  <Typography>
                    {CardProps?.session?.customerEmail
                      ? CardProps?.session.customerEmail
                      : "N/A"}
                  </Typography>
                </Box>
                <Box mt={2}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Staff Check In Email:
                  </Typography>
                  <Typography>
                    {CardProps?.session?.staffCheckInEmail}
                  </Typography>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Modal>
  );
}

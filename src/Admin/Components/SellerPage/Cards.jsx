import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  IconButton,
  styled,
} from "@mui/material";
import { FaStar } from "react-icons/fa6";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import { useNavigate } from "react-router-dom";

const StyledCard = styled(Card)({
  height: "100%",
  borderRadius: 10,
  boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
  "& .MuiCardContent-root": {
    padding: 24,
  },
});

const Cards = ({ sellers }) => {
  const navigate = useNavigate();

  return (
    <Grid container spacing={3}>
      {sellers.map((seller) => (
        <Grid item xs={12} md={6} lg={4} key={seller._id}>
          <StyledCard onClick={() => navigate(`/sellerdetails/${seller._id}`)}>
            <CardContent>
              <Box
                
                sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Avatar
                    sx={{ width: 48, height: 48, borderRadius: "12px" }}
                    src={seller.images[0]}
                  >
                    {seller.ownername?.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {seller.ownername}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "#0A5FBF", fontWeight: 600, fontSize: 12 }}
                    >
                      #{seller._id.slice(-5)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton color="primary">
                  <FaStar />
                </IconButton>
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="#9FA3A8"
                    fontWeight={600}
                    sx={{ letterSpacing: "1px", display: "block", mb: 0.8 }}
                  >
                    STORE TYPE
                  </Typography>
                  <Typography variant="body1" fontWeight={900} fontSize={12}>
                    {seller.storetype}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="#9FA3A8"
                    fontWeight={600}
                    sx={{ letterSpacing: "1px", display: "block", mb: 0.8 }}
                  >
                    CITY
                  </Typography>
                  <Typography variant="body1" fontWeight={900} fontSize={12}>
                    {seller.city}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography
                    variant="caption"
                    color="#9FA3A8"
                    fontWeight={600}
                    sx={{ letterSpacing: "1px", display: "block", mb: 0.8 }}
                  >
                    STATUS
                  </Typography>
                  <Typography
                    variant="body1"
                    fontWeight={900}
                    fontSize={12}
                    sx={{
                      color: seller.status === "approved" ? "green" : "red",
                    }}
                  >
                    {seller.status}
                  </Typography>
                </Grid>
              </Grid>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    width: 155,
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#0A5FBF",
                    backgroundColor: "#4E95F233",
                    p: 1,
                    borderRadius: 2,
                  }}
                >
                  <EmailOutlinedIcon sx={{ fontSize: 16 }} />
                  <Typography variant="body2" fontSize={11}>
                    {seller.email}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexGrow: 1,
                    height: 35,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                    color: "#9FA3A8",
                    backgroundColor: "#F4F4F4",
                    p: 1,
                    borderRadius: 2,
                  }}
                >
                  <LocalPhoneOutlinedIcon sx={{ fontSize: 17 }} />
                  <Typography
                    variant="body2"
                    fontSize={11}
                    sx={{ flexGrow: 1 }}
                  >
                    {seller.number}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default Cards;

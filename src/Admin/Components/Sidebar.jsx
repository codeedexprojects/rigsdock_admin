import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Box,
  Collapse,
} from "@mui/material";
import {
  Dashboard,
  Group,
  ShoppingCart,
  Inventory,
  AccountBalance,
  Person,
  Settings,
  Assessment,
  Notifications,
  Logout,
  ExpandLess,
  ExpandMore,
  Category,
  RequestPage,
  ViewList,
  LocalOffer,
  ChatBubbleOutline,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import LatestNotification from "./Notification/LatestNotification";
import LatestVendorNotification from "../../Vendor/vendornotification/LatestVendorNotification";

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 260,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 260,
    background: "linear-gradient(180deg, #0066CC 0%, #004C99 100%)",
    color: "white",
    paddingTop: theme.spacing(2),
    overflowY: "auto",
    "&::-webkit-scrollbar": { display: "none" },
    scrollbarWidth: "none",
    msOverflowStyle: "none",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
  },
}));

const StyledListItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== "active" && prop !== "level",
})(({ active, level = 0, theme }) => ({
  padding: `10px ${16 + level * 12}px`,
  borderRadius: 12,
  marginBottom: 4,
  transition: "all 0.3s ease",
  fontWeight: 600,
  fontSize: "14px",
  lineHeight: "20px",
  backgroundColor: active ? "#FFFFFF" : "transparent",
  color: active ? "#0066CC" : "white",
  "&:hover": {
    backgroundColor: level === 0 ? "#FFFFFF" : "rgba(255, 255, 255, 0.1)",
    color: level === 0 ? "#0066CC" : "white",
    "& .MuiListItemIcon-root": {
      color: level === 0 ? "#0066CC" : "white",
    },
  },
  "& .MuiListItemIcon-root": {
    color: active ? "#0066CC" : "white",
    minWidth: "40px",
  },
  "& .MuiListItemText-primary": {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Poppins, sans-serif",
    lineHeight: "20px",
  },
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "12px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "1px",
  marginBottom: theme.spacing(1),
  paddingLeft: theme.spacing(2),
}));

const Sidebar = ({ onSelect }) => {
  const [activeSection, setActiveSection] = useState("/dashboard");
  const [openSellers, setOpenSellers] = useState(false);
  const [openProducts, setOpenProducts] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  // const [openSubCategories, setOpenSubCategories] = useState(false);
  const [openManagingTools, setOpenManagingTools] = useState(false);
  const [openNotification, setOpenNotification] = useState(false);
  // const [openingAnalytics, setOpeningAnalytics] = useState(false);

  const navigate = useNavigate();

  const handleSelect = (path) => {
    setActiveSection(path);
    navigate(path);
    if (onSelect) {
      onSelect(path);
    }
  };
  const [loginType, setLoginType] = useState(null);

  useEffect(() => {
    const storedLoginType = localStorage.getItem("rigsdock_admin")
      ? "admin"
      : localStorage.getItem("rigsdock_vendor")
      ? "vendor"
      : null;

    setLoginType(storedLoginType);
  }, []);

  return (
    <StyledDrawer variant="permanent" anchor="left">
      <Box
        sx={{
          padding: "16px 20px",
          fontSize: "1.5rem",
          fontWeight: "bold",
          color: "white",
          textAlign: "center",
          letterSpacing: "1px",
          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
        }}
      >
        RIGSDOCK
      </Box>
      {loginType === "admin" ? (
        <>
          <Box sx={{ px: 2, mb: 3 }}>
            <SectionTitle>Admin tools</SectionTitle>
            <List>
              <StyledListItem
                onClick={() => handleSelect("/home")}
                button
                active={activeSection === "/home"}
              >
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </StyledListItem>

              <StyledListItem
                onClick={() => setOpenSellers(!openSellers)}
                button
                active={activeSection.includes("/seller")}
              >
                <ListItemIcon>
                  <Group />
                </ListItemIcon>
                <ListItemText primary="Sellers" />
                {openSellers ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openSellers} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/seller")}
                    button
                    level={1}
                    active={activeSection === "/seller"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Sellers" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/sellerRequest")}
                    button
                    level={1}
                    active={activeSection === "/sellerRequest"}
                  >
                    <ListItemIcon>
                      <RequestPage />
                    </ListItemIcon>
                    <ListItemText primary="Seller Requests" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/seller-ProfileRequest")}
                    button
                    level={1}
                    active={activeSection === "/seller-ProfileRequest"}
                  >
                    <ListItemIcon>
                      <RequestPage />
                    </ListItemIcon>
                    <ListItemText primary="Seller Profile Request" />
                  </StyledListItem>
                </List>
              </Collapse>

              <StyledListItem
                onClick={() => handleSelect("/orders")}
                button
                active={activeSection === "/orders"}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </StyledListItem>

              <StyledListItem
                onClick={() => setOpenProducts(!openProducts)}
                button
                active={activeSection === "/products"}
              >
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Products" />
                {openProducts ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openProducts} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/viewProducts")}
                    button
                    level={1}
                    active={activeSection === "/viewProducts"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Products" />
                  </StyledListItem>
                </List>
              </Collapse>

              <StyledListItem
                onClick={() => setOpenCategories(!openCategories)}
                button
                active={activeSection.includes("/category")}
              >
                <ListItemIcon>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="Categories" />
                {openCategories ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openCategories} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/viewCategory")}
                    button
                    level={1}
                    active={activeSection === "/viewCategory"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Categories" />
                  </StyledListItem>
                  <StyledListItem
                    onClick={() => handleSelect("/viewSub")}
                    button
                    level={1}
                    active={activeSection === "/viewSub"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View SubCategories" />
                  </StyledListItem>
                </List>
              </Collapse>

              <StyledListItem
                onClick={() => setOpenManagingTools(!openManagingTools)}
                button
                active={activeSection.includes("/managing")}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Managing Tools" />
                {openManagingTools ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openManagingTools} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/carousel")}
                    button
                    level={1}
                    active={activeSection === "/carousel"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Carousel" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/coupon")}
                    button
                    level={1}
                    active={activeSection === "/coupon"}
                  >
                    <ListItemIcon>
                      <LocalOffer />
                    </ListItemIcon>
                    <ListItemText primary="Coupon" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/dealsoftheday")}
                    button
                    level={1}
                    active={activeSection === "/dealsoftheday"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Deals of the Day" />
                  </StyledListItem>
                </List>
              </Collapse>

              <StyledListItem
                onClick={() => handleSelect("/account-analysis")}
                button
                active={activeSection === "/account-analysis"}
              >
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText primary="Account Analysis" />
              </StyledListItem>

              <StyledListItem
                onClick={() => handleSelect("/profile")}
                button
                active={activeSection === "/profile"}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </StyledListItem>
            </List>
          </Box>

          <Divider
            sx={{
              margin: "0 16px",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          <Box sx={{ px: 2, mt: 3 }}>
            <SectionTitle>Insights</SectionTitle>
            <List>
              <StyledListItem
                onClick={() => handleSelect("/reports")}
                button
                active={activeSection === "/reports"}
              >
                <ListItemIcon>
                  <Assessment />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                <Badge
                  badgeContent={18}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#4E95F2",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </StyledListItem>

              <StyledListItem onClick={() => setOpenNotification(true)} button>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
                <Badge
                  badgeContent={9}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#4E95F2",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </StyledListItem>
              <LatestNotification
                open={openNotification}
                onClose={() => setOpenNotification(false)}
              />

              <StyledListItem onClick={() => handleSelect("/logout")} button>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </StyledListItem>
            </List>
          </Box>
        </>
      ) : loginType === "vendor" ? (
        <>
          <Box sx={{ px: 2, mb: 3 }}>
            <SectionTitle>Vendor tools</SectionTitle>
            <List>
              <StyledListItem
                onClick={() => handleSelect("/vendor-dashboard")}
                button
                active={activeSection === "/vendor-dashboard"}
              >
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </StyledListItem>
              <StyledListItem
                onClick={() => handleSelect("/vendor-orders")}
                button
                active={activeSection === "/vendor-orders"}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Orders" />
              </StyledListItem>

              <StyledListItem
                onClick={() => setOpenProducts(!openProducts)}
                button
                active={activeSection === "/vendor-products"}
              >
                <ListItemIcon>
                  <Inventory />
                </ListItemIcon>
                <ListItemText primary="Products" />
                {openProducts ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openProducts} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/vendor-viewProducts")}
                    button
                    level={1}
                    active={activeSection === "/vendor-viewProducts"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Products" />
                  </StyledListItem>
                </List>
              </Collapse>
              <StyledListItem
                onClick={() => handleSelect("/vendor-offer")}
                button
                active={activeSection === "/vendor-offer"}
              >
                <ListItemIcon>
                  <ShoppingCart />
                </ListItemIcon>
                <ListItemText primary="Offer" />
              </StyledListItem>
              <StyledListItem
                onClick={() => setOpenCategories(!openCategories)}
                button
                active={activeSection.includes("/vendor-category")}
              >
                <ListItemIcon>
                  <Category />
                </ListItemIcon>
                <ListItemText primary="Categories" />
                {openCategories ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openCategories} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/vendor-viewCategory")}
                    button
                    level={1}
                    active={activeSection === "/vendor-viewCategory"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Categories" />
                  </StyledListItem>
                  <StyledListItem
                    onClick={() => handleSelect("/vendor-viewSub")}
                    button
                    level={1}
                    active={activeSection === "/vendor-viewSub"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="View Sub Categories" />
                  </StyledListItem>
                  {/* <StyledListItem
                    onClick={() => setOpenSubCategories(!openSubCategories)}
                    button
                    level={1}
                    active={activeSection === "/vendor-view-subcategories"}
                  >
                    <ListItemIcon>
                      <Category fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Sub-Categories" />
                    {openSubCategories ? <ExpandLess /> : <ExpandMore />}
                  </StyledListItem>

                  <Collapse in={openSubCategories} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      <StyledListItem
                        onClick={() => handleSelect("/vendor-viewSub")}
                        button
                        level={2}
                        active={activeSection === "/vendor-viewSub"}
                      >
                        <ListItemText primary="View Sub-Categories" />
                      </StyledListItem>
                    </List>
                  </Collapse> */}
                </List>
              </Collapse>
              <StyledListItem
                onClick={() => handleSelect("/vendor-coupon")}
                button
                active={activeSection === "/vendor-coupon"}
              >
                <ListItemIcon>
                  <LocalOffer />
                </ListItemIcon>
                <ListItemText primary="Coupons" />
              </StyledListItem>
              <StyledListItem
                onClick={() => handleSelect("/vendor-chat")}
                button
                active={activeSection === "/vendor-chat"}
              >
                <ListItemIcon>
                  <ChatBubbleOutline />
                </ListItemIcon>
                <ListItemText primary="Chat" />
              </StyledListItem>
              <StyledListItem
                onClick={() => setOpenManagingTools(!openManagingTools)}
                button
                active={activeSection.includes("/managing")}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Managing Tools" />
                {openManagingTools ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openManagingTools} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/vendor-carousel")}
                    button
                    level={1}
                    active={activeSection === "/vendor-carousel"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Carousel" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/vendor-dealsoftheday")}
                    button
                    level={1}
                    active={activeSection === "/vendor-dealsoftheday"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Deals of the Day" />
                  </StyledListItem>
                </List>
              </Collapse>

              {/* <StyledListItem
                onClick={() => setOpeningAnalytics(!openingAnalytics)}
                button
                active={activeSection.includes("/analytics")}
              >
                <ListItemIcon>
                  <Settings />
                </ListItemIcon>
                <ListItemText primary="Analytics and Reports" />
                {openingAnalytics ? <ExpandLess /> : <ExpandMore />}
              </StyledListItem>

              <Collapse in={openingAnalytics} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <StyledListItem
                    onClick={() => handleSelect("/vendor-sales-insights")}
                    button
                    level={1}
                    active={activeSection === "/vendor-sales-insights"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Sales insights" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/vendor-product-performance")}
                    button
                    level={1}
                    active={activeSection === "/vendor-product-performance"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Product Performance" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/vendor-product-performance")}
                    button
                    level={1}
                    active={activeSection === "/vendor-product-performance"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Product Performance" />
                  </StyledListItem>

                  <StyledListItem
                    onClick={() => handleSelect("/vendor-customer-feedback")}
                    button
                    level={1}
                    active={activeSection === "/vendor-customer-feedback"}
                  >
                    <ListItemIcon>
                      <ViewList />
                    </ListItemIcon>
                    <ListItemText primary="Customer Feedback" />
                  </StyledListItem>
                </List>
              </Collapse> */}

              <StyledListItem
                onClick={() => handleSelect("/vendor-account-analysis")}
                button
                active={activeSection === "/vendor-account-analysis"}
              >
                <ListItemIcon>
                  <AccountBalance />
                </ListItemIcon>
                <ListItemText primary="Account Analysis" />
              </StyledListItem>

              <StyledListItem
                onClick={() => handleSelect("/vendor-profile")}
                button
                active={activeSection === "/vendor-profile"}
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </StyledListItem>
            </List>
          </Box>

          <Divider
            sx={{
              margin: "0 16px",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          />

          <Box sx={{ px: 2, mt: 3 }}>
            <SectionTitle>Insights</SectionTitle>
            <List>
              <StyledListItem
                onClick={() => handleSelect("/vendor-reports")}
                button
                active={activeSection === "/vendor-reports"}
              >
                <ListItemIcon>
                  <Assessment />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                <Badge
                  badgeContent={18}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#4E95F2",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </StyledListItem>

              <StyledListItem
                onClick={() => handleSelect("/vendor-review")}
                button
                active={activeSection === "/vendor-review"}
              >
                <ListItemIcon>
                  <Assessment />
                </ListItemIcon>
                <ListItemText primary="Review" />
                <Badge
                  badgeContent={18}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#4E95F2",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </StyledListItem>

              <StyledListItem onClick={() => setOpenNotification(true)} button>
                <ListItemIcon>
                  <Notifications />
                </ListItemIcon>
                <ListItemText primary="Notifications" />
                <Badge
                  badgeContent={9}
                  sx={{
                    "& .MuiBadge-badge": {
                      backgroundColor: "#4E95F2",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />
              </StyledListItem>
              <LatestVendorNotification
                open={openNotification}
                onClose={() => setOpenNotification(false)}
              />

              <StyledListItem onClick={() => handleSelect("/logout")} button>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Log out" />
              </StyledListItem>
            </List>
          </Box>
        </>
      ) : (
        <p>Please log in</p>
      )}
    </StyledDrawer>
  );
};

export default Sidebar;

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

interface ScrollToTopProps {
  behavior?: ScrollBehavior;
  top?: number;
  left?: number;
}

export const ScrollToTop: React.FC<ScrollToTopProps> = ({
  behavior = "smooth",
  top = 0,
  left = 0,
}) => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    window.scrollTo({
      top,
      left,
      behavior,
    });
  }, [pathname, behavior, top, left]);

  return null; // This component doesn't render anything
};

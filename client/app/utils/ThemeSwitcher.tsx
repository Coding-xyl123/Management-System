/* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import { useState, useEffect } from "react";
// import { useTheme } from "next-themes";
// import { BiMoon, BiSun } from "react-icons/bi";

// export const ThemeSwitcher = () => {
//   const [mounted, setMounted] = useState(false);
//   const { theme, setTheme } = useTheme();

//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null;

//   return (
//     <div className="flex items-center justify-center mx-4">
//       {theme === "light" ? (
//         <BiMoon
//           className="cursor-pointer"
//           fill="black"
//           size={25}
//           onClick={() => setTheme("dark")}
//         />
//       ) : (
//         <BiSun
//           size={25}
//           className="cursor-pointer"
//           fill="white"
//           onClick={() => setTheme("light")}
//         />
//       )}
//     </div>
//   );
// };
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { BiMoon, BiSun } from "react-icons/bi";

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // Allow component to mount after hydration on client
    setMounted(true);

    // Set initial theme based on system preference if not set
    if (!theme) {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    }
  }, [setTheme, theme]);

  if (!mounted) return null;

  return (
    <div className="flex items-center justify-center mx-4">
      {theme === "light" ? (
        <BiMoon
          className="cursor-pointer"
          fill="black"
          size={25}
          onClick={() => setTheme("dark")}
        />
      ) : (
        <BiSun
          size={25}
          className="cursor-pointer"
          fill="white"
          onClick={() => setTheme("light")}
        />
      )}
    </div>
  );
};

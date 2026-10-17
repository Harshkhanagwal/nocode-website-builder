import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import colorThemeReducer from "./slices/colorThemeSlice";
import typographyReducer from "./slices/typographySlice";
import projectReducer from "./slices/projectSlice";
import heroReducer from "./slices/heroSlice";
import sectionReducer from "./slices/sectionSlice";


export const store = configureStore({
  reducer: {
    auth: authReducer,
    colorThemes: colorThemeReducer,
    typography: typographyReducer,
    project: projectReducer,
    hero: heroReducer,
    sections: sectionReducer,
  },
});


// How to use it in your components

// import { useDispatch } from "react-redux";
// import { createSection } from "../../redux/slices/sectionSlice";

// const dispatch = useDispatch();

// const handleAddColumns = async () => {
//   try {
//     const result = await dispatch(
//       createSection({
//         websiteId,
//         sectionName: "columns",
//         data: {
//           variant: "classic",
//           content: {
//             eyebrow: "Our Features",
//             headline: "Everything You Need",
//             href: "#features",
//             items: [],
//           },
//         },
//       })
//     ).unwrap();

//     console.log("Created section:", result.section);
//   } catch (error) {
//     console.error(error);
//   }
// };



// ------------ update ----------

// await dispatch(
//   updateSection({
//     websiteId,
//     sectionName: "about",
//     data: {
//       content: {
//         headline: "About Our Company",
//         href: "/about",
//       },
//     },
//   })
// ).unwrap();


// -------- delete -----

// await dispatch(
//   deleteSection({
//     websiteId,
//     sectionName: "accordion",
//   })
// ).unwrap();



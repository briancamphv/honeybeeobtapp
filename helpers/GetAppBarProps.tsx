import { workflow } from "@/interfaces/appInterfaces";
import { WorkFlowColors, WorkFlowIcons, WorkFlowTitles } from "./Enumerators";

const getAppBarProps = (step: string): workflow => {
  switch (step) {
    case "learn":
      return {
        title: WorkFlowTitles.learn,
        color: WorkFlowColors.learn,
        icon: WorkFlowIcons.learn,
        helpfile: "learn",
      };

    case "translate":
      return {
        title: WorkFlowTitles.translate,
        color: WorkFlowColors.translate,
        icon: WorkFlowIcons.translate,
        helpfile: "translate",
      };

    case "naturalness":
      return {
        title: WorkFlowTitles.naturalness,
        color: WorkFlowColors.naturalness,
        icon: WorkFlowIcons.naturalness,
        helpfile: "naturalness",
      };

    case "accuracy":
      return {
        title: WorkFlowTitles.accuracy,
        color: WorkFlowColors.accuracy,
        icon: WorkFlowIcons.accuracy,
        helpfile: "accuracy",
      };

    case "voice":
      return {
        title: WorkFlowTitles.voice,
        color: WorkFlowColors.voice,
        icon: WorkFlowIcons.voice,
        helpfile: "voice",
      };

    case "finalize":
      return {
        title: WorkFlowTitles.finalize,
        color: WorkFlowColors.finalize,
        icon: WorkFlowIcons.finalize,
        helpfile: "finalize",
      };

    case "review":
      return {
        title: WorkFlowTitles.review,
        color: WorkFlowColors.review,
        icon: WorkFlowIcons.review,
        helpfile: "review",
      };

    default:
      return {
        title: "",
        color: "",
        icon: "",
        helpfile: "",
      };
  }
};

export default getAppBarProps;

import create from "zustand"

const commonStore = create<{
    camera: "followCamClose" | "followCamFar" | "orbitCam" | "fixedCam",
    changeCamera: (toupdate:"followCamClose" | "followCamFar" | "orbitCam" | "fixedCam") => void
}>((set:any) => ({
  camera: "followCamClose",
  changeCamera: (toupdate:"followCamClose" | "followCamFar" | "orbitCam" | "fixedCam") => set({ camera: toupdate}),
}))

export default commonStore

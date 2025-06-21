import { Link } from "lucide-react";

export default function Demo() {
  return (
    <div
      className="dark:bg-slate-900 bg-white text-slate-900 dark:text-white"
      style={{
        position: "relative",
        // paddingBottom: 0,
        height: "100vh",
        // backgroundColor: "rgb(30 63 141);",
        width: "100vw",
        overflowY: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <iframe
        src="https://demo.arcade.software/XtOIypjMsxyiULvNs00J?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
        title="DEVLOG | Log your coding journey"
        frameBorder="0"
        loading="lazy"
        allowFullScreen
        allow="clipboard-write"
        style={{
          width: "100%",
          height: "100%",
          maxWidth: "1200px",
          colorScheme: "light",
        }}
      />
    </div>
  );
}

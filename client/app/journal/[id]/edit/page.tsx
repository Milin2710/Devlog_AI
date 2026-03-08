import EditEntry from "./Edit";

export const metadata = {
  title: "*Edit Journal",
  icons: {
    icon: "/workingicon.ico",
  },
};

export default function EditEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <EditEntry params={params} />;
}

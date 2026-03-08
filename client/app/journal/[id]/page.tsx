import Entry from "./Journal";

export const metadata = {
  title: "Journal Entry",
};

export default function EntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <Entry params={params} />;
}

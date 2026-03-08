import GameScreen from "@/components/GameScreen";

interface GamePageProps {
  params: Promise<{ game: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { game } = await params;
  return <GameScreen game={game} />;
}

export function generateStaticParams() {
  return [{ game: "fr" }, { game: "lg" }];
}

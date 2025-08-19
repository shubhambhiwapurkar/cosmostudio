import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Sparkles } from "lucide-react";

const AstrologicalCard = ({
  icon: Icon,
  title,
  sign,
  description,
  color,
}: {
  icon: React.ElementType;
  title: string;
  sign: string;
  description: string;
  color: string;
}) => (
  <Card className="bg-card/50 backdrop-blur-sm">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={`h-5 w-5 ${color}`} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{sign}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function BirthChartDisplay() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Your Cosmic Blueprint</h2>
        <p className="text-muted-foreground">A summary of your key astrological placements.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <AstrologicalCard
          icon={Sun}
          title="Sun Sign"
          sign="Aries"
          description="Your core identity & ego."
          color="text-yellow-400"
        />
        <AstrologicalCard
          icon={Moon}
          title="Moon Sign"
          sign="Taurus"
          description="Your emotional inner world."
          color="text-slate-300"
        />
        <AstrologicalCard
          icon={Sparkles}
          title="Ascendant"
          sign="Leo"
          description="Your social personality."
          color="text-purple-400"
        />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notable Aspects</h3>
        <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Sun Trine Moon</Badge>
            <Badge variant="outline">Venus Conjunct Mars</Badge>
            <Badge variant="outline">Jupiter Square Saturn</Badge>
            <Badge variant="outline">Mercury Sextile Pluto</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
            These are just highlights. Ask your AI astrologer for a deeper interpretation.
        </p>
      </div>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import { SimpleBirthChart, BirthChartPosition } from "@/lib/types";

const AstrologicalCard = ({
  icon: Icon,
  title,
  sign,
  description,
  color,
  delay = 0,
}: {
  icon: React.ElementType;
  title: string;
  sign: string;
  description: string;
  color: string;
  delay?: number;
}) => (
  <Card
    className="bg-card/50 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
    style={{ animationDelay: `${delay}ms` }}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className={cn("h-5 w-5", color)} />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{sign}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function BirthChartDisplay({ onLinkClick }: { onLinkClick?: () => void}) {
  const [birthChart, setBirthChart] = useState<SimpleBirthChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getValidToken } = useAuth();

  useEffect(() => {
    const fetchBirthChart = async () => {
      try {
        const token = await getValidToken();
        if (!token) {
          throw new Error("Authentication token not found.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chart/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch birth chart data.");
        }

        const data = await response.json();
        setBirthChart(data as SimpleBirthChart);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBirthChart();
  }, [getValidToken]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="grid gap-4 md:grid-cols-1">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-1/4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-28" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
        <p>Please try again later or contact support.</p>
      </div>
    );
  }

  if (!birthChart) {
    return (
      <div>
        <p>You have not created a birth chart yet.</p>
      </div>
    );
  }

  const sunPosition = birthChart.positions.find((p) => p.planet === 'Sun');
  const moonPosition = birthChart.positions.find((p) => p.planet === 'Moon');
  const ascPosition = birthChart.positions.find((p) => p.planet === 'Ascendant');

  return (
    <div className="space-y-6">
      <div className="space-y-1 animate-in fade-in-0 duration-500">
        <h2 className="text-2xl font-bold tracking-tight">Your Cosmic Blueprint</h2>
        <p className="text-muted-foreground">A summary of your key astrological placements.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        {sunPosition && (
          <AstrologicalCard
            icon={Sun}
            title="Sun Sign"
            sign={sunPosition.sign}
            description="Your core identity & ego."
            color="text-yellow-400"
            delay={100}
          />
        )}
        {moonPosition && (
          <AstrologicalCard
            icon={Moon}
            title="Moon Sign"
            sign={moonPosition.sign}
            description="Your emotional inner world."
            color="text-slate-300"
            delay={200}
          />
        )}
        {ascPosition && (
          <AstrologicalCard
            icon={Sparkles}
            title="Ascendant"
            sign={ascPosition.sign}
            description="Your social personality."
            color="text-purple-400"
            delay={300}
          />
        )}
      </div>
      
      <div className="space-y-4 animate-in fade-in-0 duration-500" style={{ animationDelay: '400ms' }}>
        <h3 className="text-lg font-semibold">Notable Aspects</h3>
        <div className="flex flex-wrap gap-2">
          {birthChart.aspects.slice(0, 4).map((aspect, index) => (
            <Badge key={index} variant="outline">{`${aspect.planet1} ${aspect.aspect} ${aspect.planet2}`}</Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
            These are just highlights. {' '}
            <a href="#" className="text-primary underline" onClick={(e) => { e.preventDefault(); onLinkClick?.(); }}>
                Ask your AI astrologer
            </a>
            {' '} for a deeper interpretation.
        </p>
      </div>
    </div>
  );
}

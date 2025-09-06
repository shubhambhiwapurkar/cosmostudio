import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, LocationData } from '@/lib/types';

interface UserProfileProps {
  user: User;
}

const formatLocation = (place: LocationData): string => {
  const parts = [place.city];
  if (place.state) parts.push(place.state);
  if (place.country) parts.push(place.country);
  return parts.join(', ');
};

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  const displayName = `${user.first_name} ${user.last_name}`;
  const initial = user.first_name?.charAt(0) || user.email?.charAt(0) || '';
  const formattedLocation = formatLocation(user.birth_details.place);
  const formattedDate = new Date(user.birth_details.date).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={""} alt={displayName} /> {/* No photoURL in new API */}
            <AvatarFallback>{initial.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <p className="text-sm text-muted-foreground">Birth Date: {formattedDate}</p>
            <p className="text-sm text-muted-foreground">Birth Time: {user.birth_details.time}</p>
            <p className="text-sm text-muted-foreground">Birth Place: {formattedLocation}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
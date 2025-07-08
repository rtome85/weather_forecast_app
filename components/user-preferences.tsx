"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { User, Heart, DollarSign, Clock } from "lucide-react"

interface UserPreferences {
  interests: string[]
  budgetRange: string
  preferredDuration: string
  activityLevel: number
  indoorOutdoorPreference: string
  timePreferences: string[]
}

interface UserPreferencesProps {
  preferences: UserPreferences
  onPreferencesChange: (preferences: UserPreferences) => void
  isOpen: boolean
  onClose: () => void
}

export function UserPreferences({ preferences, onPreferencesChange, isOpen, onClose }: UserPreferencesProps) {
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences)

  const interests = [
    "Art & Culture",
    "Music",
    "Food & Dining",
    "Sports & Fitness",
    "Nature & Outdoors",
    "Shopping",
    "Entertainment",
    "Education",
    "Photography",
    "History",
    "Technology",
    "Wellness",
  ]

  const budgetOptions = ["Free", "$", "$$", "$$$"]
  const durationOptions = ["< 1 hour", "1-2 hours", "2-4 hours", "4+ hours", "Full day"]
  const timeOptions = ["Morning", "Afternoon", "Evening", "Night"]

  const handleInterestToggle = (interest: string) => {
    const newInterests = localPreferences.interests.includes(interest)
      ? localPreferences.interests.filter((i) => i !== interest)
      : [...localPreferences.interests, interest]

    setLocalPreferences({ ...localPreferences, interests: newInterests })
  }

  const handleSave = () => {
    onPreferencesChange(localPreferences)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personalize Your Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Interests */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4" />
              Interests
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {interests.map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={localPreferences.interests.includes(interest)}
                    onCheckedChange={() => handleInterestToggle(interest)}
                  />
                  <Label htmlFor={interest} className="text-sm">
                    {interest}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Budget Range */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <DollarSign className="h-4 w-4" />
              Budget Preference
            </Label>
            <div className="flex gap-2">
              {budgetOptions.map((budget) => (
                <Badge
                  key={budget}
                  variant={localPreferences.budgetRange === budget ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setLocalPreferences({ ...localPreferences, budgetRange: budget })}
                >
                  {budget}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activity Duration */}
          <div>
            <Label className="text-base font-semibold flex items-center gap-2 mb-3">
              <Clock className="h-4 w-4" />
              Preferred Duration
            </Label>
            <div className="flex flex-wrap gap-2">
              {durationOptions.map((duration) => (
                <Badge
                  key={duration}
                  variant={localPreferences.preferredDuration === duration ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setLocalPreferences({ ...localPreferences, preferredDuration: duration })}
                >
                  {duration}
                </Badge>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Activity Level (1 = Relaxed, 10 = High Energy)</Label>
            <Slider
              value={[localPreferences.activityLevel]}
              onValueChange={(value) => setLocalPreferences({ ...localPreferences, activityLevel: value[0] })}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-center mt-2 text-sm text-gray-600">Level: {localPreferences.activityLevel}</div>
          </div>

          {/* Indoor/Outdoor Preference */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Indoor/Outdoor Preference</Label>
            <div className="flex gap-2">
              {["Indoor", "Outdoor", "No Preference"].map((pref) => (
                <Badge
                  key={pref}
                  variant={localPreferences.indoorOutdoorPreference === pref ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setLocalPreferences({ ...localPreferences, indoorOutdoorPreference: pref })}
                >
                  {pref}
                </Badge>
              ))}
            </div>
          </div>

          {/* Time Preferences */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Preferred Times</Label>
            <div className="flex gap-2">
              {timeOptions.map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <Checkbox
                    id={time}
                    checked={localPreferences.timePreferences.includes(time)}
                    onCheckedChange={(checked) => {
                      const newTimes = checked
                        ? [...localPreferences.timePreferences, time]
                        : localPreferences.timePreferences.filter((t) => t !== time)
                      setLocalPreferences({ ...localPreferences, timePreferences: newTimes })
                    }}
                  />
                  <Label htmlFor={time} className="text-sm">
                    {time}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              Save Preferences
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

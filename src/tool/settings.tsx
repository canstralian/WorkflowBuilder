import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { SiGithubactions } from "react-icons/si";
import { common, fonts } from "./styles";

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Card className={common.card}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <SiGithubactions className="w-8 h-8 text-[#0077B6]" />
          <CardTitle className={`text-2xl ${fonts.heading}`}>Workflow Wizard Settings</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={fonts.body}>Dark Mode</span>
            <Button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={common.button.primary}
            >
              {isDarkMode ? "Enabled" : "Disabled"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

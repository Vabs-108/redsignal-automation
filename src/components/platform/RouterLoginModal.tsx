import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Server, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface RouterLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: string;
}

export function RouterLoginModal({ isOpen, onClose, vendor }: RouterLoginModalProps) {
  const [ipAddress, setIpAddress] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!ipAddress || !username || !password) {
      setError("All fields are required");
      return;
    }

    setIsConnecting(true);

    // Simulate connection attempt
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // For demo purposes, simulate successful connection
    setIsConnecting(false);
    setIsConnected(true);
    
    toast({
      title: "Connection Successful",
      description: `Connected to ${vendor} at ${ipAddress}`,
    });

    // Reset after showing success
    setTimeout(() => {
      onClose();
      setIsConnected(false);
      setIpAddress("");
      setUsername("");
      setPassword("");
    }, 1500);
  };

  const handleClose = () => {
    if (!isConnecting) {
      onClose();
      setError("");
      setIsConnected(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Server className="w-6 h-6 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-foreground">
                Connect to {vendor}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Enter router credentials to establish connection
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isConnected ? (
          <div className="flex flex-col items-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">Connected!</h3>
            <p className="text-muted-foreground text-sm">{ipAddress}</p>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="ip" className="text-foreground">
                Router IP Address
              </Label>
              <Input
                id="ip"
                type="text"
                placeholder="192.168.1.1"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                disabled={isConnecting}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="text-foreground">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isConnecting}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isConnecting}
                className="bg-secondary border-border focus:border-primary"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isConnecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isConnecting}
                className={cn(
                  "flex-1 bg-primary text-primary-foreground hover:bg-primary/90",
                  isConnecting && "opacity-80"
                )}
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { useState } from 'react';
import { toast } from 'sonner';
import { Users, MailPlus, UserCheck, Clock, ShieldCheck, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useBudget } from '../context/BudgetContext';
import { cn } from '@/lib/utils';

interface BudgetSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetSharingDialog({ open, onOpenChange }: BudgetSharingDialogProps) {
  const {
    budgetName,
    members,
    outgoingInvites,
    inviteToBudget,
    revokeInvite,
    isBudgetAdmin,
    activeBudgetRole,
  } = useBudget();
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email.trim()) {
      setInviteError('Necesitamos un correo para enviar la invitación.');
      return;
    }

    setIsSending(true);
    setInviteError(null);
    try {
      await inviteToBudget(email);
      toast.success('Invitación enviada', {
        description: 'Le avisamos a la persona para que se una a tu presupuesto.',
      });
      setEmail('');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No pudimos enviar la invitación. Intenta nuevamente.';
      setInviteError(message);
      toast.error('No pudimos enviar la invitación', { description: message });
    } finally {
      setIsSending(false);
    }
  };

  const handleRevoke = async (id: string) => {
    setRevokingId(id);
    try {
      await revokeInvite(id);
      toast.success('Invitación cancelada');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No pudimos cancelar la invitación. Intenta nuevamente.';
      toast.error('No se pudo cancelar la invitación', { description: message });
    } finally {
      setRevokingId(null);
    }
  };

  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === b.role) {
      return a.email?.localeCompare(b.email ?? '') ?? 0;
    }
    return a.role === 'owner' ? -1 : 1;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-6 p-0 overflow-hidden">
        <DialogHeader className="space-y-1 px-6 pt-6">
          <DialogTitle className="text-xl font-semibold tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            Compartir tu presupuesto
          </DialogTitle>
          <DialogDescription>
            Compartí el presupuesto &ldquo;{budgetName || 'Presupuesto mindful'}&rdquo; con las personas que
            lo gestionan con vos.
          </DialogDescription>
        </DialogHeader>

        <Separator />

        <ScrollArea className="max-h-[480px]">
          <div className="space-y-6 px-6 py-6">
            <section className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Personas con acceso</h3>
                  <Badge variant="outline">{sortedMembers.length}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Tu rol actual es <strong className="capitalize">{activeBudgetRole ?? 'editor'}</strong>.
                </p>
              </div>

              <div className="space-y-3">
                {sortedMembers.map((member) => (
                  <div
                    key={member.userId}
                    className={cn(
                      'flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-4 py-3',
                      member.isCurrentUser && 'border-primary/50',
                    )}
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {member.email ?? 'Cuenta sin correo'}
                        {member.isCurrentUser ? (
                          <Badge variant="secondary" className="ml-2">
                            Vos
                          </Badge>
                        ) : null}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Se unió el {new Date(member.createdAt).toLocaleDateString('es-AR', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <Badge variant={member.role === 'owner' ? 'default' : 'outline'} className="capitalize">
                      {member.role === 'owner' ? <ShieldCheck className="mr-1 h-3.5 w-3.5" /> : null}
                      {member.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Invitaciones</h3>
                  <p className="text-xs text-muted-foreground">
                    Invitá a otra persona a colaborar en el presupuesto.
                  </p>
                </div>
                <Badge variant="outline">{outgoingInvites.length}</Badge>
              </div>

              <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  disabled={!isBudgetAdmin || isSending}
                  className="sm:flex-1"
                />
                <Button type="submit" disabled={!isBudgetAdmin || isSending}>
                  <MailPlus className="mr-2 h-4 w-4" />
                  Enviar invitación
                </Button>
              </form>
              {inviteError ? <p className="text-xs text-destructive">{inviteError}</p> : null}

              <div className="space-y-3">
                {outgoingInvites.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border/60 bg-muted/30 px-4 py-6 text-center text-xs text-muted-foreground">
                    Aún no invitaste a nadie. Cuando envíes una invitación, la verás aquí.
                  </div>
                ) : (
                  outgoingInvites.map((invite) => (
                    <div
                      key={invite.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background px-4 py-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{invite.email}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {new Date(invite.createdAt).toLocaleDateString('es-AR', { dateStyle: 'medium' })}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <UserCheck className="h-3.5 w-3.5" />
                            Rol: {invite.role}
                          </span>
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={invite.status === 'pending' ? 'secondary' : 'outline'}
                          className="capitalize"
                        >
                          {invite.status}
                        </Badge>
                        {isBudgetAdmin && invite.status === 'pending' ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRevoke(invite.id)}
                            disabled={revokingId === invite.id}
                          >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Cancelar invitación</span>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

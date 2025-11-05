import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Users, MailPlus, UserCheck, Clock, ShieldCheck, X, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBudget, type BudgetRole } from '../context/BudgetContext';
import { cn } from '@/lib/utils';

interface BudgetSharingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ROLE_LABELS: Record<BudgetRole, string> = {
  owner: 'Administra',
  editor: 'Ver y editar',
  viewer: 'Solo ver',
};

const INVITE_ROLE_OPTIONS: Array<{ value: BudgetRole; label: string; description: string }> = [
  {
    value: 'viewer',
    label: 'Solo ver',
    description: 'Puede ver el presupuesto, pero no editarlo.',
  },
  {
    value: 'editor',
    label: 'Ver y editar',
    description: 'Puede agregar o modificar movimientos.',
  },
];

export function BudgetSharingDialog({ open, onOpenChange }: BudgetSharingDialogProps) {
  const {
    budgetName,
    members,
    outgoingInvites,
    inviteToBudget,
    revokeInvite,
    isBudgetAdmin,
    activeBudgetRole,
    updateMemberRole,
    removeMember,
  } = useBudget();
  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<BudgetRole>('viewer');
  const [isSending, setIsSending] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [memberUpdating, setMemberUpdating] = useState<string | null>(null);
  const [memberRemoving, setMemberRemoving] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setInviteError(null);
      setIsSending(false);
      setInviteRole('viewer');
      setRevokingId(null);
      setMemberUpdating(null);
      setMemberRemoving(null);
    }
  }, [open]);

  const handleInvite = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim();

    if (!isBudgetAdmin) {
      setInviteError('Solo la persona administradora puede enviar invitaciones.');
      return;
    }

    if (!normalizedEmail) {
      setInviteError('Necesitamos un correo para enviar la invitación.');
      return;
    }

    setIsSending(true);
    setInviteError(null);
    try {
      const result = await inviteToBudget(normalizedEmail, inviteRole);
      if (!result) {
        throw new Error('No pudimos generar la invitación. Intenta nuevamente.');
      }

      toast.success('Invitación enviada', {
        description: `Le avisamos a ${normalizedEmail} para que se una con permisos de “${ROLE_LABELS[inviteRole]}”.`,
      });
      setEmail('');
      setInviteRole('viewer');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No pudimos enviar la invitación. Intenta nuevamente.';
      setInviteError(message);
      toast.error('No pudimos enviar la invitación', { description: message });
    } finally {
      setIsSending(false);
    }
  };

  const handleMemberRoleChange = async (memberId: string, role: BudgetRole) => {
    setMemberUpdating(memberId);
    try {
      const currentRole = members.find((member) => member.userId === memberId)?.role;
      if (currentRole === role) {
        return;
      }
      await updateMemberRole(memberId, role);
      toast.success('Rol actualizado', {
        description: `La persona ahora tiene permisos de “${ROLE_LABELS[role]}”.`,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No pudimos actualizar el rol. Intenta nuevamente.';
      toast.error('No pudimos actualizar el rol', { description: message });
    } finally {
      setMemberUpdating(null);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    setMemberRemoving(memberId);
    try {
      await removeMember(memberId);
      toast.success('Persona removida del presupuesto');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'No pudimos quitar a la persona. Intenta nuevamente.';
      toast.error('No pudimos quitar a la persona', { description: message });
    } finally {
      setMemberRemoving(null);
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
  const selectedInviteRole = INVITE_ROLE_OPTIONS.find((option) => option.value === inviteRole);
  const canManageMembers = isBudgetAdmin;

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
                {!isBudgetAdmin ? (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Solo quien administra el presupuesto puede cambiar permisos o quitar personas.
                  </p>
                ) : null}
              </div>

              <div className="space-y-3">
                {sortedMembers.map((member) => {
                  const roleLabel = ROLE_LABELS[member.role] ?? member.role;
                  const joinedAt = new Date(member.createdAt).toLocaleDateString('es-AR', { dateStyle: 'medium' });
                  const canChangeRole = canManageMembers && !member.isCurrentUser && member.role !== 'owner';
                  const canRemoveThisMember = canManageMembers && !member.isCurrentUser && member.role !== 'owner';
                  const isUpdating = memberUpdating === member.userId;
                  const isRemoving = memberRemoving === member.userId;

                  return (
                    <div
                      key={member.userId}
                      className={cn(
                        'flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between',
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
                          Se unió el {joinedAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {member.role === 'owner' ? (
                          <Badge variant="default" className="capitalize">
                            <ShieldCheck className="mr-1 h-3.5 w-3.5" />
                            {roleLabel}
                          </Badge>
                        ) : canManageMembers ? (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleMemberRoleChange(member.userId, value as BudgetRole)}
                            disabled={!canChangeRole || isUpdating}
                          >
                            <SelectTrigger className="w-[180px] capitalize">
                              <SelectValue placeholder="Permisos" />
                            </SelectTrigger>
                            <SelectContent>
                              {INVITE_ROLE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <Badge variant="outline" className="capitalize">
                            {roleLabel}
                          </Badge>
                        )}

                        {canRemoveThisMember ? (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMember(member.userId)}
                            disabled={isRemoving}
                          >
                            {isRemoving ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Quitar acceso</span>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
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
                  {!isBudgetAdmin ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      No tenés permisos para enviar invitaciones.
                    </p>
                  ) : null}
                </div>
                <Badge variant="outline">{outgoingInvites.length}</Badge>
              </div>

              <form onSubmit={handleInvite} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex w-full flex-col gap-2 sm:flex-1 sm:flex-row">
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    disabled={!isBudgetAdmin || isSending}
                    className="sm:flex-[2]"
                  />
                  <Select
                    value={inviteRole}
                    onValueChange={(value) => setInviteRole(value as BudgetRole)}
                    disabled={!isBudgetAdmin || isSending}
                  >
                    <SelectTrigger className="w-full sm:flex-1 capitalize">
                      <SelectValue placeholder="Permisos" />
                    </SelectTrigger>
                    <SelectContent>
                      {INVITE_ROLE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={!isBudgetAdmin || isSending}>
                  <MailPlus className="mr-2 h-4 w-4" />
                  {isSending ? 'Enviando...' : 'Enviar invitación'}
                </Button>
              </form>
              {inviteError ? <p className="text-xs text-destructive">{inviteError}</p> : null}
              {selectedInviteRole ? (
                <p className="text-xs text-muted-foreground">
                  {selectedInviteRole.description}
                </p>
              ) : null}

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
                            Rol: {ROLE_LABELS[(invite.role as BudgetRole)] ?? invite.role}
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

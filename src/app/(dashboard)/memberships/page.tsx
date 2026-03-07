import { getPlans } from '@/app/actions/memberships';
import AddMembershipModal from '@/components/AddMembershipModal';
import EditMembershipModal from '@/components/EditMembershipModal';

export default async function MembershipsPage() {
  const plans = await getPlans();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Membership Plans</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage available plans and pricing options.</p>
        </div>
        <AddMembershipModal />
      </div>

      {plans.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-12 text-center text-slate-500">
          <h3 className="text-lg font-medium text-slate-900 dark:text-white">No plans created</h3>
          <p className="mt-1">Create your first membership plan to get started.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className={`rounded-xl border ${plan.is_popular ? 'border-2 border-[#1337ec]' : 'border-slate-200 dark:border-slate-800'} bg-white dark:bg-slate-900 shadow-sm p-6 flex flex-col items-center text-center relative`}>
              {plan.is_popular && (
                <div className="absolute top-0 -translate-y-1/2 bg-[#1337ec] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>
              )}
              <h3 className={`text-xl font-bold ${plan.is_popular ? 'text-[#1337ec] dark:text-blue-400' : ''}`}>{plan.name}</h3>
              <p className="mt-2 text-slate-500 text-sm max-w-[200px] whitespace-normal flex-wrap break-words">{plan.description || ''}</p>
              <div className="my-4 text-3xl font-bold">${plan.price} <span className="text-sm font-normal text-slate-500">/{plan.billing_cycle === 'monthly' ? 'mo' : plan.billing_cycle === 'yearly' ? 'yr' : 'cycle'}</span></div>
              <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 mb-6">
                {plan.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="whitespace-normal flex-wrap break-words max-w-[200px]">{feature}</li>
                ))}
              </ul>
              <EditMembershipModal plan={plan} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

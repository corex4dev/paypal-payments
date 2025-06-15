import React from "react";
import PlanCard from "./_components/PlanCard";

const PlansPage = () => (
  <section>
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
        <PlanCard
          name="Pro"
          description="Pro Plan"
          features={["Feature 1", "Feature 2", "Something else"]}
          price={10}
          plan_id="P-1L721807AH494662PNBHONEY"
        />
        <PlanCard
          name="Ultimate"
          description="Ultimate Plan"
          features={["Premium feature"]}
          price={20}
          plan_id="P-6N980933F4646501TNBHONMQ"
        />
      </div>
    </div>
  </section>
);

export default PlansPage;

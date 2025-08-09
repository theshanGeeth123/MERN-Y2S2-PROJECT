import React from "react";
import UserSummaryReport from "../components/UserReport/UserSummaryReport";
import AgeDistributionChart from "../components/UserReport/AgeDistributionChart";
import EmailDomainReport from "../components/UserReport/EmailDomainReport";

export default function ReportsPage() {
  return (
    <div>
      <h1>User Reports</h1>
      <UserSummaryReport />
      <AgeDistributionChart />
      <EmailDomainReport />
    </div>
  );
}

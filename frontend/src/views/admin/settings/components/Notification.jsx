import Card from "components/card";
import CardMenu from "components/card/CardMenu";
import Switch from "components/switch";
import React from "react";

function Notification() {
  return (
    <Card extra={"w-full h-full p-3"}>
      <div className="relative mb-3 flex items-center justify-between pt-1">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          Notification Preferences
        </h4>
        <CardMenu />
      </div>

      <div className="flex flex-col">
        {/* Incident & Alert Notifications */}
        <div className="mt-3 flex items-center gap-3">
          <Switch id="incident-alerts" />
          <label
            htmlFor="incident-alerts"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Critical incident alerts (P1 / P2)
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="anomaly-detection" />
          <label
            htmlFor="anomaly-detection"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            AI-detected anomalies (metrics, logs, traces)
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="threshold-breach" />
          <label
            htmlFor="threshold-breach"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Threshold breach alerts (CPU, Memory, Disk, Latency)
          </label>
        </div>

        {/* System & Infrastructure */}
        <div className="mt-4 flex items-center gap-3">
          <Switch id="host-health" />
          <label
            htmlFor="host-health"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Host & service health status changes
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="agent-status" />
          <label
            htmlFor="agent-status"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Monitoring agent offline / heartbeat failures
          </label>
        </div>

        {/* AIOps / ML Signals */}
        <div className="mt-4 flex items-center gap-3">
          <Switch id="root-cause" />
          <label
            htmlFor="root-cause"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            AI root-cause analysis insights
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="forecasting" />
          <label
            htmlFor="forecasting"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Predictive alerts (capacity & failure forecasting)
          </label>
        </div>

        {/* Reports & Platform Updates */}
        <div className="mt-4 flex items-center gap-3">
          <Switch id="daily-summary" />
          <label
            htmlFor="daily-summary"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Daily system health summary
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="weekly-report" />
          <label
            htmlFor="weekly-report"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Weekly performance & incident report
          </label>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Switch id="platform-updates" />
          <label
            htmlFor="platform-updates"
            className="text-base font-medium text-navy-700 dark:text-white"
          >
            Platform updates & new AIOps features
          </label>
        </div>
      </div>
    </Card>
  );
}

export default Notification;

## WF HolaSpirit Community Connector

A Data Studio Community Connector for the HolaSpirit API.

Originally inspired by need to on-demand break down FTE allocation by circle and member.

### Options

* Username/Password Auth
* Data Sources Included:
    * Members
    * Circles
    * Roles
    * Member Allocations (de-normalized combination of members/circles/roles)
* Simple 15 Minute Caching

### Screenshots

![Data Studio Dashboard](/docs/DataStudio_Dashboard.png)

![Data Studio Report](/docs/HolaSpirit_Allocation_Breakdown.png)

### Code

Written in App Script and deployed with [Clasp](https://github.com/google/clasp).

/***
 *  DataPower XML management interface API
 *  Author: Raj Bandi (http://www.rajbandi.dev)
 *  Date: 15-Nov-2019
 ***/
const DataPowerStatusTypes = {

ActiveUsers: "ActiveUsers",
APISubscriberCacheStatus: "APISubscriberCacheStatus",
APISubscriberStatus: "APISubscriberStatus",
ARPStatus: "ARPStatus",
AS1PollerSourceProtocolHandlerSummary: "AS1PollerSourceProtocolHandlerSummary",
AS2SourceProtocolHandlerSummary: "AS2SourceProtocolHandlerSummary",
AS3SourceProtocolHandlerSummary: "AS3SourceProtocolHandlerSummary",
AuthCookieCacheStatus: "AuthCookieCacheStatus",
B2BGatewaySummary: "B2BGatewaySummary",
B2BHighAvailabilityStatus: "B2BHighAvailabilityStatus",
B2BMessageArchiveStatus: "B2BMessageArchiveStatus",
B2BMPCStatus: "B2BMPCStatus",
B2BMPCStatus2: "B2BMPCStatus2",
B2BTransactionLog: "B2BTransactionLog",
B2BTransactionLog2: "B2BTransactionLog2",
Battery: "Battery",
ChangeGroupRetryQueue: "ChangeGroupRetryQueue",
ChangeGroups: "ChangeGroups",
CloudConnectorServiceSummary: "CloudConnectorServiceSummary",
CloudGatewayServiceSummary: "CloudGatewayServiceSummary",
ConfigSequenceStatus: "ConfigSequenceStatus",
ConnectionsAccepted: "ConnectionsAccepted",
CPUUsage: "CPUUsage",
CryptoEngineStatus: "CryptoEngineStatus",
CryptoEngineStatus2: "CryptoEngineStatus2",
CryptoHwDisableStatus: "CryptoHwDisableStatus",
CryptoModeStatus: "CryptoModeStatus",
CurrentSensors: "CurrentSensors",
DateTimeStatus: "DateTimeStatus",
DateTimeStatus2: "DateTimeStatus2",
DebugActionStatus: "DebugActionStatus",
DNSCacheHostStatus: "DNSCacheHostStatus",
DNSCacheHostStatus2: "DNSCacheHostStatus2",
DNSCacheHostStatus3: "DNSCacheHostStatus3",
DNSCacheHostStatus4: "DNSCacheHostStatus4",
DNSNameServerStatus: "DNSNameServerStatus",
DNSNameServerStatus2: "DNSNameServerStatus2",
DNSSearchDomainStatus: "DNSSearchDomainStatus",
DNSStaticHostStatus: "DNSStaticHostStatus",
DocumentCachingSummary: "DocumentCachingSummary",
DocumentCachingSummaryGlobal: "DocumentCachingSummaryGlobal",
DocumentStatus: "DocumentStatus",
DocumentStatusSimpleIndex: "DocumentStatusSimpleIndex",
DomainCheckpointStatus: "DomainCheckpointStatus",
DomainsMemoryStatus: "DomainsMemoryStatus",
DomainsMemoryStatus2: "DomainsMemoryStatus2",
DomainStatus: "DomainStatus",
DomainSummary: "DomainSummary",
DynamicQueueManager: "DynamicQueueManager",
DynamicTibcoEMSStatus: "DynamicTibcoEMSStatus",
EBMS2SourceProtocolHandlerSummary: "EBMS2SourceProtocolHandlerSummary",
EBMS3SourceProtocolHandlerSummary: "EBMS3SourceProtocolHandlerSummary",
EnvironmentalFanSensors: "EnvironmentalFanSensors",
EnvironmentalSensors: "EnvironmentalSensors",
EthernetCountersStatus: "EthernetCountersStatus",
EthernetInterfaceStatus: "EthernetInterfaceStatus",
EthernetMAUStatus: "EthernetMAUStatus",
EthernetMIIRegisterStatus: "EthernetMIIRegisterStatus",
FailureNotificationStatus: "FailureNotificationStatus",
FailureNotificationStatus2: "FailureNotificationStatus2",
FibreChannelLuns: "FibreChannelLuns",
FibreChannelVolumeStatus: "FibreChannelVolumeStatus",
FilePollerStatus: "FilePollerStatus",
FilesystemStatus: "FilesystemStatus",
FirmwareStatus: "FirmwareStatus",
FirmwareStatus2: "FirmwareStatus2",
FirmwareVersion: "FirmwareVersion",
FirmwareVersion2: "FirmwareVersion2",
FirmwareVersion3: "FirmwareVersion3",
FTPFilePollerSourceProtocolHandlerSummary: "FTPFilePollerSourceProtocolHandlerSummary",
FTPServerSourceProtocolHandlerSummary: "FTPServerSourceProtocolHandlerSummary",
GatewayPeeringCacheStatus: "GatewayPeeringCacheStatus",
GatewayPeeringStatus: "GatewayPeeringStatus",
GatewayTransactions: "GatewayTransactions",
HSMKeyStatus: "HSMKeyStatus",
HTTPConnections: "HTTPConnections",
HTTPConnectionsCreated: "HTTPConnectionsCreated",
HTTPConnectionsDestroyed: "HTTPConnectionsDestroyed",
HTTPConnectionsOffered: "HTTPConnectionsOffered",
HTTPConnectionsRequested: "HTTPConnectionsRequested",
HTTPConnectionsReturned: "HTTPConnectionsReturned",
HTTPConnectionsReused: "HTTPConnectionsReused",
HTTPMeanTransactionTime: "HTTPMeanTransactionTime",
HTTPMeanTransactionTime2: "HTTPMeanTransactionTime2",
HTTPServiceSummary: "HTTPServiceSummary",
HTTPSourceProtocolHandlerSummary: "HTTPSourceProtocolHandlerSummary",
HTTPSSourceProtocolHandlerSummary: "HTTPSSourceProtocolHandlerSummary",
HTTPTransactions: "HTTPTransactions",
HTTPTransactions2: "HTTPTransactions2",
Hypervisor: "Hypervisor",
Hypervisor2: "Hypervisor2",
Hypervisor3: "Hypervisor3",
IGMPStatus: "IGMPStatus",
IMSConnectSourceProtocolHandlerSummary: "IMSConnectSourceProtocolHandlerSummary",
IMSConnectstatus: "IMSConnectstatus",
IPAddressStatus: "IPAddressStatus",
IPMISelEvents: "IPMISelEvents",
IPMulticastStatus: "IPMulticastStatus",
IScsiHBAStatus: "IScsiHBAStatus",
IScsiInitiatorStatus: "IScsiInitiatorStatus",
IScsiTargetStatus: "IScsiTargetStatus",
IScsiVolumeStatus: "IScsiVolumeStatus",
KerberosTickets: "KerberosTickets",
KerberosTickets2: "KerberosTickets2",
LDAPPoolEntries: "LDAPPoolEntries",
LDAPPoolSummary: "LDAPPoolSummary",
LibraryVersion: "LibraryVersion",
LicenseStatus: "LicenseStatus",
LinkAggregationMemberStatus: "LinkAggregationMemberStatus",
LinkAggregationStatus: "LinkAggregationStatus",
LinkStatus: "LinkStatus",
LoadBalancerStatus: "LoadBalancerStatus",
LoadBalancerStatus2: "LoadBalancerStatus2",
LogTargetStatus: "LogTargetStatus",
LunaLatency: "LunaLatency",
MemoryStatus: "MemoryStatus",
MessageCountFilters: "MessageCountFilters",
MessageCounts: "MessageCounts",
MessageDurationFilters: "MessageDurationFilters",
MessageDurations: "MessageDurations",
MessageSources: "MessageSources",
MQConnStatus: "MQConnStatus",
MQFTESourceProtocolHandlerSummary: "MQFTESourceProtocolHandlerSummary",
MQQMstatus: "MQQMstatus",
MQSourceProtocolHandlerSummary: "MQSourceProtocolHandlerSummary",
MQStatus: "MQStatus",
MQSystemResources: "MQSystemResources",
MultiProtocolGatewaySummary: "MultiProtocolGatewaySummary",
NDCacheStatus: "NDCacheStatus",
NDCacheStatus2: "NDCacheStatus2",
NetworkInterfaceStatus: "NetworkInterfaceStatus",
NetworkReceiveDataThroughput: "NetworkReceiveDataThroughput",
NetworkReceivePacketThroughput: "NetworkReceivePacketThroughput",
NetworkTransmitDataThroughput: "NetworkTransmitDataThroughput",
NetworkTransmitPacketThroughput: "NetworkTransmitPacketThroughput",
NFSFilePollerSourceProtocolHandlerSummary: "NFSFilePollerSourceProtocolHandlerSummary",
NFSMountStatus: "NFSMountStatus",
NTPRefreshStatus: "NTPRefreshStatus",
OAuthCachesStatus: "OAuthCachesStatus",
ObjectStatus: "ObjectStatus",
ODRConnectorGroupStatus: "ODRConnectorGroupStatus",
ODRConnectorGroupStatus2: "ODRConnectorGroupStatus2",
ODRLoadBalancerStatus: "ODRLoadBalancerStatus",
OtherSensors: "OtherSensors",
PCIBus: "PCIBus",
PolicyDomainStatus: "PolicyDomainStatus",
POPPollerSourceProtocolHandlerSummary: "POPPollerSourceProtocolHandlerSummary",
PortStatus: "PortStatus",
PowerSensors: "PowerSensors",
QueueManagersStatus: "QueueManagersStatus",
QuotaEnforcementStatus: "QuotaEnforcementStatus",
RaidArrayStatus: "RaidArrayStatus",
RaidBatteryBackUpStatus: "RaidBatteryBackUpStatus",
RaidBatteryModuleStatus: "RaidBatteryModuleStatus",
RaidLogicalDriveStatus: "RaidLogicalDriveStatus",
RaidPartitionStatus: "RaidPartitionStatus",
RaidPhysDiskStatus: "RaidPhysDiskStatus",
RaidPhysDiskStatus2: "RaidPhysDiskStatus2",
RaidPhysicalDriveStatus: "RaidPhysicalDriveStatus",
RaidSsdStatus: "RaidSsdStatus",
RaidVolumeStatus: "RaidVolumeStatus",
RaidVolumeStatus2: "RaidVolumeStatus2",
RateLimitAPIStatus: "RateLimitAPIStatus",
RateLimitAssemblyStatus: "RateLimitAssemblyStatus",
RateLimitConcurrentStatus: "RateLimitConcurrentStatus",
RateLimitCountStatus: "RateLimitCountStatus",
RateLimitRateStatus: "RateLimitRateStatus",
RateLimitTokenBucketStatus: "RateLimitTokenBucketStatus",
ReceiveKbpsThroughput: "ReceiveKbpsThroughput",
ReceivePacketThroughput: "ReceivePacketThroughput",
RoutingStatus: "RoutingStatus",
RoutingStatus2: "RoutingStatus2",
RoutingStatus3: "RoutingStatus3",
SecureCloudConnectorConnectionsStatus: "SecureCloudConnectorConnectionsStatus",
SelfBalancedStatus: "SelfBalancedStatus",
SelfBalancedStatus2: "SelfBalancedStatus2",
SelfBalancedTable: "SelfBalancedTable",
ServicesMemoryStatus: "ServicesMemoryStatus",
ServicesMemoryStatus2: "ServicesMemoryStatus2",
ServicesStatus: "ServicesStatus",
ServicesStatusPlus: "ServicesStatusPlus",
ServiceVersionStatus: "ServiceVersionStatus",
SFTPFilePollerSourceProtocolHandlerSummary: "SFTPFilePollerSourceProtocolHandlerSummary",
SGClientConnectionStatus: "SGClientConnectionStatus",
SGClientStatus: "SGClientStatus",
SLMPeeringStatus: "SLMPeeringStatus",
SLMSummaryStatus: "SLMSummaryStatus",
SNMPStatus: "SNMPStatus",
SQLConnectionPoolStatus: "SQLConnectionPoolStatus",
SQLRuntimeStatus: "SQLRuntimeStatus",
SQLStatus: "SQLStatus",
SSHKnownHostFileStatus: "SSHKnownHostFileStatus",
SSHKnownHostFileStatus2: "SSHKnownHostFileStatus2",
SSHKnownHostStatus: "SSHKnownHostStatus",
SSHServerSourceProtocolHandlerSummary: "SSHServerSourceProtocolHandlerSummary",
SSHTrustedHostStatus: "SSHTrustedHostStatus",
SSLProxyServiceSummary: "SSLProxyServiceSummary",
StandbyStatus: "StandbyStatus",
StandbyStatus2: "StandbyStatus2",
StatelessTCPSourceProtocolHandlerSummary: "StatelessTCPSourceProtocolHandlerSummary",
StylesheetCachingSummary: "StylesheetCachingSummary",
StylesheetExecutions: "StylesheetExecutions",
StylesheetExecutionsSimpleIndex: "StylesheetExecutionsSimpleIndex",
StylesheetMeanExecutionTime: "StylesheetMeanExecutionTime",
StylesheetMeanExecutionTimeSimpleIndex: "StylesheetMeanExecutionTimeSimpleIndex",
StylesheetProfiles: "StylesheetProfiles",
StylesheetProfilesSimpleIndex: "StylesheetProfilesSimpleIndex",
StylesheetStatus: "StylesheetStatus",
StylesheetStatusSimpleIndex: "StylesheetStatusSimpleIndex",
SystemCpuStatus: "SystemCpuStatus",
SystemMemoryStatus: "SystemMemoryStatus",
SystemUsage: "SystemUsage",
SystemUsage2Table: "SystemUsage2Table",
SystemUsageTable: "SystemUsageTable",
TCPProxyServiceSummary: "TCPProxyServiceSummary",
TCPSummary: "TCPSummary",
TCPTable: "TCPTable",
TemperatureSensors: "TemperatureSensors",
TenantLicenses: "TenantLicenses",
TenantMemory: "TenantMemory",
TibcoEMSSourceProtocolHandlerSummary: "TibcoEMSSourceProtocolHandlerSummary",
TibcoEMSStatus: "TibcoEMSStatus",
TransmitKbpsThroughput: "TransmitKbpsThroughput",
TransmitPacketThroughput: "TransmitPacketThroughput",
UDDISubscriptionKeyStatusSimpleIndex: "UDDISubscriptionKeyStatusSimpleIndex",
UDDISubscriptionServiceStatusSimpleIndex: "UDDISubscriptionServiceStatusSimpleIndex",
UDDISubscriptionStatusSimpleIndex: "UDDISubscriptionStatusSimpleIndex",
Version: "Version",
VirtualPlatform: "VirtualPlatform",
VirtualPlatform2: "VirtualPlatform2",
VirtualPlatform3: "VirtualPlatform3",
VlanInterfaceStatus: "VlanInterfaceStatus",
VlanInterfaceStatus2: "VlanInterfaceStatus2",
VoltageSensors: "VoltageSensors",
WebAppFwAccepted: "WebAppFwAccepted",
WebAppFwRejected: "WebAppFwRejected",
WebAppFWSummary: "WebAppFWSummary",
WebSphereJMSSourceProtocolHandlerSummary: "WebSphereJMSSourceProtocolHandlerSummary",
WebSphereJMSStatus: "WebSphereJMSStatus",
WebTokenServiceSummary: "WebTokenServiceSummary",
WSGatewaySummary: "WSGatewaySummary",
WSMAgentSpoolers: "WSMAgentSpoolers",
WSMAgentStatus: "WSMAgentStatus",
WSOperationMetrics: "WSOperationMetrics",
WSOperationMetricsSimpleIndex: "WSOperationMetricsSimpleIndex",
WSOperationsStatus: "WSOperationsStatus",
WSOperationsStatusSimpleIndex: "WSOperationsStatusSimpleIndex",
WSRRSavdSrchSubsPolicyAttachmentsStatus: "WSRRSavdSrchSubsPolicyAttachmentsStatus",
WSRRSavedSearchSubscriptionServiceStatus: "WSRRSavedSearchSubscriptionServiceStatus",
WSRRSavedSearchSubscriptionStatus: "WSRRSavedSearchSubscriptionStatus",
WSRRSubscriptionPolicyAttachmentsStatus: "WSRRSubscriptionPolicyAttachmentsStatus",
WSRRSubscriptionServiceStatus: "WSRRSubscriptionServiceStatus",
WSRRSubscriptionStatus: "WSRRSubscriptionStatus",
WSWSDLStatus: "WSWSDLStatus",
WSWSDLStatusSimpleIndex: "WSWSDLStatusSimpleIndex",
WXSGridStatus: "WXSGridStatus",
XC10GridStatus: "XC10GridStatus",
XMLFirewallServiceSummary: "XMLFirewallServiceSummary",
XMLNamesStatus: "XMLNamesStatus",
XSLCoprocServiceSummary: "XSLCoprocServiceSummary",
XSLProxyServiceSummary: "XSLProxyServiceSummary",
XTCProtocolHandlerSummary: "XTCProtocolHandlerSummary",
ZHybridTCSstatus: "ZHybridTCSstatus",
ZosNSSstatus: "ZosNSSstatus"
}

module.exports = DataPowerStatusTypes;
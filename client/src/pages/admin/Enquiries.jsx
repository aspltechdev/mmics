import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Eye,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  ChevronDown,
  Mail,
  Phone,
  CalendarDays,
  FileText,
  ArrowUpRight,
  Loader2,
  Package,
  Users,
} from "lucide-react";

import enquiryService from "../../services/enquiryService";
import "./Enquiries.css";

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_OPTIONS = [
  { value: "ALL", label: "All enquiries" },
  { value: "NEW", label: "New" },
  { value: "READ", label: "Read" },
  { value: "REPLIED", label: "Replied" },
  { value: "CLOSED", label: "Closed" },
];

const TYPE_OPTIONS = [
  { value: "ALL", label: "All types" },
  { value: "PRODUCT", label: "Product" },
  { value: "MEMBERSHIP", label: "Membership" },
  { value: "CONTACT", label: "Contact" },
];

const STATUS_CONFIG = {
  NEW: {
    label: "New",
    className: "new",
    icon: AlertCircle,
  },
  READ: {
    label: "Read",
    className: "read",
    icon: Eye,
  },
  REPLIED: {
    label: "Replied",
    className: "replied",
    icon: MessageSquare,
  },
  CLOSED: {
    label: "Closed",
    className: "closed",
    icon: CheckCircle2,
  },
};

const TYPE_CONFIG = {
  PRODUCT: {
    label: "Product",
    className: "product",
    icon: Package,
  },
  MEMBERSHIP: {
    label: "Membership",
    className: "membership",
    icon: Users,
  },
  CONTACT: {
    label: "Contact",
    className: "contact",
    icon: MessageSquare,
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatus = (enquiry) =>
  (enquiry?.status || "NEW").toString().toUpperCase();

const getStatusConfig = (status) =>
  STATUS_CONFIG[status] || STATUS_CONFIG.NEW;

const getEnquiryType = (enquiry) =>
  (enquiry?.type || "CONTACT").toString().toUpperCase();

const getTypeConfig = (type) =>
  TYPE_CONFIG[type] || TYPE_CONFIG.CONTACT;

const getEnquiryName = (enquiry) =>
  enquiry?.name ||
  enquiry?.fullName ||
  enquiry?.contactName ||
  "Unknown";

const getEnquiryEmail = (enquiry) =>
  enquiry?.email || enquiry?.emailAddress || "";

const getEnquiryPhone = (enquiry) =>
  enquiry?.phone ||
  enquiry?.phoneNumber ||
  enquiry?.mobile ||
  "";

const getEnquirySubject = (enquiry) =>
  enquiry?.subject || enquiry?.title || "General Enquiry";

const getEnquiryMessage = (enquiry) =>
  enquiry?.message ||
  enquiry?.description ||
  enquiry?.query ||
  "";

const getEnquiryDate = (enquiry) =>
  enquiry?.createdAt ||
  enquiry?.submittedAt ||
  enquiry?.date ||
  null;

const getProductName = (enquiry) => {
  if (enquiry?.product?.name) {
    return enquiry.product.name;
  }

  if (getEnquiryType(enquiry) === "PRODUCT") {
    return "General product enquiry";
  }

  return "—";
};

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  return parsedDate.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// COMPONENT
// ============================================================

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  // ============================================================
  // FETCH
  // ============================================================

  const fetchEnquiries = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await enquiryService.getAll();
      const data = response?.enquiries || response?.data || [];

      setEnquiries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch enquiries error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load enquiries."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // ============================================================
  // STATS
  // ============================================================

  const stats = useMemo(() => {
    const total = enquiries.length;

    const newCount = enquiries.filter(
      (item) => getStatus(item) === "NEW"
    ).length;

    const productCount = enquiries.filter(
      (item) => getEnquiryType(item) === "PRODUCT"
    ).length;

    const membershipCount = enquiries.filter(
      (item) => getEnquiryType(item) === "MEMBERSHIP"
    ).length;

    return {
      total,
      newCount,
      productCount,
      membershipCount,
    };
  }, [enquiries]);

  const statusCounts = useMemo(() => {
    return {
      NEW: enquiries.filter((item) => getStatus(item) === "NEW").length,
      READ: enquiries.filter((item) => getStatus(item) === "READ").length,
      REPLIED: enquiries.filter((item) => getStatus(item) === "REPLIED").length,
      CLOSED: enquiries.filter((item) => getStatus(item) === "CLOSED").length,
    };
  }, [enquiries]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredEnquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const status = getStatus(enquiry);
      const type = getEnquiryType(enquiry);

      if (statusFilter !== "ALL" && status !== statusFilter) {
        return false;
      }

      if (typeFilter !== "ALL" && type !== typeFilter) {
        return false;
      }

      if (!query) {
        return true;
      }

      const searchableText = [
        getEnquiryName(enquiry),
        getEnquiryEmail(enquiry),
        getEnquiryPhone(enquiry),
        getEnquirySubject(enquiry),
        getEnquiryMessage(enquiry),
        getEnquiryType(enquiry),
        getProductName(enquiry),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [enquiries, search, statusFilter, typeFilter]);

  // ============================================================
  // VIEW
  // ============================================================

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedEnquiry(null);
  };

  // ============================================================
  // STATUS UPDATE
  // ============================================================

  const handleStatusChange = async (enquiry, status) => {
    const id = enquiry?.id;
    if (!id) return;

    try {
      setStatusUpdating(id);
      setError("");

      await enquiryService.updateStatus(id, status);

      setEnquiries((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status,
              }
            : item
        )
      );

      setSelectedEnquiry((current) =>
        current?.id === id
          ? {
              ...current,
              status,
            }
          : current
      );
    } catch (err) {
      console.error("Update enquiry status error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setStatusUpdating(null);
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const openDeleteModal = (enquiry) => {
    setDeleteTarget(enquiry);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) return;
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) return;

    try {
      setDeleteLoading(true);
      setError("");

      await enquiryService.remove(deleteTarget.id);

      setEnquiries((current) =>
        current.filter((item) => item.id !== deleteTarget.id)
      );

      if (selectedEnquiry?.id === deleteTarget.id) {
        closeViewModal();
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error("Delete enquiry error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to delete enquiry."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ============================================================
  // ESCAPE + BODY SCROLL
  // ============================================================

  useEffect(() => {
    const modalOpen = viewModalOpen || Boolean(deleteTarget);

    if (modalOpen) {
      document.body.classList.add("mmics-enquiry-modal-open");
    } else {
      document.body.classList.remove("mmics-enquiry-modal-open");
    }

    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (deleteTarget) {
        closeDeleteModal();
        return;
      }

      if (viewModalOpen) {
        closeViewModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("mmics-enquiry-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [deleteTarget, viewModalOpen, deleteLoading]);

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setTypeFilter("ALL");
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="mmics-enquiries">
      {/* HEADER */}
      <div className="mmics-enquiries-header">
        <div className="mmics-enquiries-heading">
          <div className="mmics-enquiries-breadcrumb">
            <span>Admin</span>
            <span className="separator">/</span>
            <span className="current">Enquiries</span>
          </div>

          <div className="mmics-enquiries-title-row">
            <div className="mmics-enquiries-title-icon">
              <MessageSquare size={22} />
            </div>

            <div>
              <h1>Enquiries</h1>
              <p>
                Manage product, membership and website enquiries.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mmics-enquiries-refresh"
          onClick={() => fetchEnquiries(true)}
          disabled={loading || refreshing}
        >
          {refreshing ? (
            <Loader2 size={17} className="spin" />
          ) : (
            <RefreshCw size={17} />
          )}
          <span>Refresh</span>
        </button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mmics-enquiries-alert">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* STATS */}
      <div className="mmics-enquiries-stats">
        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon total">
            <MessageSquare size={20} />
          </div>
          <div className="stat-content">
            <span>Total Enquiries</span>
            <strong>{stats.total}</strong>
            <small>All received enquiries</small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon new">
            <AlertCircle size={20} />
          </div>
          <div className="stat-content">
            <span>New</span>
            <strong>{stats.newCount}</strong>
            <small>Need attention</small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon product">
            <Package size={20} />
          </div>
          <div className="stat-content">
            <span>Product</span>
            <strong>{stats.productCount}</strong>
            <small>Product enquiries</small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon membership">
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span>Membership</span>
            <strong>{stats.membershipCount}</strong>
            <small>Membership enquiries</small>
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="mmics-enquiries-toolbar">
        <div className="mmics-enquiries-search">
          <Search size={18} />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search enquiries..."
          />

          {search && (
            <button type="button" onClick={() => setSearch("")}>
              <X size={15} />
            </button>
          )}
        </div>

        <div className="mmics-enquiries-toolbar-right">
          <div className="mmics-enquiries-type-filter">
            <select
              value={typeFilter}
              onChange={(event) => setTypeFilter(event.target.value)}
              aria-label="Filter enquiry type"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} />
          </div>

          <div className="mmics-enquiries-filters">
            {STATUS_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  statusFilter === option.value ? "active" : ""
                }
                onClick={() => setStatusFilter(option.value)}
              >
                {option.label}

                {option.value !== "ALL" && (
                  <span>{statusCounts[option.value] || 0}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="mmics-enquiries-table-card">
        <div className="mmics-enquiries-table-header">
          <div>
            <h2>Enquiry List</h2>
            <p>
              {filteredEnquiries.length} result
              {filteredEnquiries.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="table-header-meta">
            <MessageSquare size={17} />
            <span>{filteredEnquiries.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="mmics-enquiries-loading">
            <Loader2 size={30} className="spin" />
            <p>Loading enquiries...</p>
          </div>
        ) : filteredEnquiries.length === 0 ? (
          <div className="mmics-enquiries-empty">
            <div className="empty-icon">
              <MessageSquare size={28} />
            </div>

            <h3>No enquiries found</h3>

            <p>
              {search || statusFilter !== "ALL" || typeFilter !== "ALL"
                ? "Try changing your search or filters."
                : "Website enquiries will appear here."}
            </p>

            {(search || statusFilter !== "ALL" || typeFilter !== "ALL") && (
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="mmics-enquiries-table-wrapper">
            <table className="mmics-enquiries-table">
              <thead>
                <tr>
                  <th>Contact</th>
                  <th>Type</th>
                  <th>Enquiry</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th className="action-column">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEnquiries.map((enquiry) => {
                  const status = getStatus(enquiry);
                  const statusConfig = getStatusConfig(status);
                  const StatusIcon = statusConfig.icon;

                  const type = getEnquiryType(enquiry);
                  const typeConfig = getTypeConfig(type);
                  const TypeIcon = typeConfig.icon;

                  return (
                    <tr key={enquiry.id}>
                      {/* CONTACT */}
                      <td>
                        <div className="enquiry-contact">
                          <div className="contact-avatar">
                            {getEnquiryName(enquiry).charAt(0).toUpperCase()}
                          </div>

                          <div className="contact-info">
                            <strong>{getEnquiryName(enquiry)}</strong>
                            <span>
                              {getEnquiryEmail(enquiry) || "No email"}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* TYPE */}
                      <td>
                        <div
                          className={`enquiry-type ${typeConfig.className}`}
                        >
                          <TypeIcon size={14} />
                          <span>{typeConfig.label}</span>
                        </div>
                      </td>

                      {/* ENQUIRY */}
                      <td>
                        <div className="enquiry-subject">
                          <strong>{getEnquirySubject(enquiry)}</strong>
                          <span>
                            {getEnquiryMessage(enquiry) || "No message"}
                          </span>
                        </div>
                      </td>

                      {/* PRODUCT */}
                      <td>
                        <div className="product-cell">
                          {type === "PRODUCT" ? (
                            <>
                              <Package size={15} />
                              <span>{getProductName(enquiry)}</span>
                            </>
                          ) : (
                            <span className="muted">—</span>
                          )}
                        </div>
                      </td>

                      {/* DATE */}
                      <td>
                        <div className="date-cell">
                          <CalendarDays size={15} />
                          <span>{formatDate(getEnquiryDate(enquiry))}</span>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td>
                        <div className="status-wrapper">
                          <div
                            className={`enquiry-status ${statusConfig.className}`}
                          >
                            <StatusIcon size={14} />
                            <span>{statusConfig.label}</span>
                          </div>

                          <div className="status-select-wrapper">
                            <select
                              value={status}
                              disabled={statusUpdating === enquiry.id}
                              onChange={(event) =>
                                handleStatusChange(
                                  enquiry,
                                  event.target.value
                                )
                              }
                            >
                              <option value="NEW">New</option>
                              <option value="READ">Read</option>
                              <option value="REPLIED">Replied</option>
                              <option value="CLOSED">Closed</option>
                            </select>
                            <ChevronDown size={13} />
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td>
                        <div className="enquiry-actions">
                          <button
                            type="button"
                            className="view"
                            title="View enquiry"
                            onClick={() => openViewModal(enquiry)}
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            type="button"
                            className="delete"
                            title="Delete enquiry"
                            onClick={() => openDeleteModal(enquiry)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewModalOpen && selectedEnquiry && (
        <div
          className="mmics-enquiries-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeViewModal();
            }
          }}
        >
          <div className="mmics-enquiries-view-modal">
            <div className="view-modal-header">
              <div>
                <div className="view-modal-kicker">ENQUIRY DETAILS</div>
                <h2>{getEnquirySubject(selectedEnquiry)}</h2>
              </div>

              <button type="button" onClick={closeViewModal}>
                <X size={19} />
              </button>
            </div>

            <div className="view-modal-body">
              <div className="enquiry-detail-contact">
                <div className="large-avatar">
                  {getEnquiryName(selectedEnquiry).charAt(0).toUpperCase()}
                </div>

                <div className="enquiry-detail-contact-main">
                  <strong>{getEnquiryName(selectedEnquiry)}</strong>
                  <span>{getEnquiryEmail(selectedEnquiry) || "Website enquiry"}</span>
                </div>

                {(() => {
                  const typeConfig = getTypeConfig(
                    getEnquiryType(selectedEnquiry)
                  );
                  const TypeIcon = typeConfig.icon;

                  return (
                    <div
                      className={`enquiry-type ${typeConfig.className} modal-type`}
                    >
                      <TypeIcon size={14} />
                      <span>{typeConfig.label}</span>
                    </div>
                  );
                })()}
              </div>

              <div className="detail-grid">
                <div className="detail-item">
                  <span>
                    <Mail size={15} />
                    Email
                  </span>

                  {getEnquiryEmail(selectedEnquiry) ? (
                    <a href={`mailto:${getEnquiryEmail(selectedEnquiry)}`}>
                      {getEnquiryEmail(selectedEnquiry)}
                      <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <strong>—</strong>
                  )}
                </div>

                <div className="detail-item">
                  <span>
                    <Phone size={15} />
                    Phone
                  </span>

                  {getEnquiryPhone(selectedEnquiry) ? (
                    <a href={`tel:${getEnquiryPhone(selectedEnquiry)}`}>
                      {getEnquiryPhone(selectedEnquiry)}
                      <ArrowUpRight size={13} />
                    </a>
                  ) : (
                    <strong>—</strong>
                  )}
                </div>

                <div className="detail-item">
                  <span>
                    <MessageSquare size={15} />
                    Enquiry Type
                  </span>
                  <strong>
                    {getTypeConfig(getEnquiryType(selectedEnquiry)).label}
                  </strong>
                </div>

                <div className="detail-item">
                  <span>
                    <CalendarDays size={15} />
                    Submitted
                  </span>
                  <strong>
                    {formatDateTime(getEnquiryDate(selectedEnquiry))}
                  </strong>
                </div>

                {getEnquiryType(selectedEnquiry) === "PRODUCT" && (
                  <div className="detail-item detail-item-full">
                    <span>
                      <Package size={15} />
                      Product
                    </span>
                    <strong>{getProductName(selectedEnquiry)}</strong>
                  </div>
                )}
              </div>

              <div className="message-section">
                <div className="section-label">
                  <FileText size={16} />
                  <span>Message</span>
                </div>

                <div className="message-box">
                  {getEnquiryMessage(selectedEnquiry) || (
                    <span className="muted">No message provided.</span>
                  )}
                </div>
              </div>

              <div className="view-status-section">
                <div>
                  <span>Current status</span>
                  <strong>
                    {getStatusConfig(getStatus(selectedEnquiry)).label}
                  </strong>
                </div>

                <select
                  value={getStatus(selectedEnquiry)}
                  disabled={statusUpdating === selectedEnquiry.id}
                  onChange={(event) =>
                    handleStatusChange(selectedEnquiry, event.target.value)
                  }
                >
                  <option value="NEW">New</option>
                  <option value="READ">Read</option>
                  <option value="REPLIED">Replied</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>
            </div>

            <div className="view-modal-footer">
              <button
                type="button"
                className="secondary"
                onClick={closeViewModal}
              >
                Close
              </button>

              {getEnquiryEmail(selectedEnquiry) && (
                <a
                  className="primary"
                  href={`mailto:${getEnquiryEmail(selectedEnquiry)}`}
                >
                  <Mail size={16} />
                  Reply by Email
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div
          className="mmics-enquiries-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteModal();
            }
          }}
        >
          <div className="mmics-enquiries-delete-modal">
            <div className="delete-icon">
              <Trash2 size={23} />
            </div>

            <h2>Delete enquiry?</h2>

            <p>
              This will permanently remove the enquiry from your admin portal.
            </p>

            <div className="delete-preview">
              <strong>{getEnquiryName(deleteTarget)}</strong>
              <span>
                {getTypeConfig(getEnquiryType(deleteTarget)).label} ·{" "}
                {getEnquirySubject(deleteTarget)}
              </span>
            </div>

            <div className="delete-actions">
              <button
                type="button"
                className="cancel"
                onClick={closeDeleteModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    Delete Enquiry
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enquiries;

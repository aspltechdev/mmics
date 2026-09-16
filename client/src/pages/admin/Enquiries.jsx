
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
  Clock3,
  AlertCircle,
  MessageSquare,
  RefreshCw,
  ChevronDown,
  Mail,
  Phone,
  User,
  CalendarDays,
  Building2,
  FileText,
  ArrowUpRight,
  Loader2,
} from "lucide-react";

import enquiryService from "../../services/enquiryService";

import "./Enquiries.css";

// ============================================================
// CONSTANTS
// ============================================================

const STATUS_OPTIONS = [
  {
    value: "ALL",
    label: "All enquiries",
  },
  {
    value: "NEW",
    label: "New",
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
  },
  {
    value: "RESOLVED",
    label: "Resolved",
  },
];

const STATUS_CONFIG = {
  NEW: {
    label: "New",
    className: "new",
    icon: AlertCircle,
  },

  IN_PROGRESS: {
    label: "In Progress",
    className: "progress",
    icon: Clock3,
  },

  RESOLVED: {
    label: "Resolved",
    className: "resolved",
    icon: CheckCircle2,
  },
};

// ============================================================
// HELPERS
// ============================================================

const getStatus = (enquiry) => {
  return (
    enquiry?.status ||
    "NEW"
  ).toString().toUpperCase();
};

const getStatusConfig = (status) => {
  return (
    STATUS_CONFIG[status] ||
    STATUS_CONFIG.NEW
  );
};

const getEnquiryName = (enquiry) => {
  return (
    enquiry?.name ||
    enquiry?.fullName ||
    enquiry?.contactName ||
    "Unknown"
  );
};

const getEnquiryEmail = (enquiry) => {
  return (
    enquiry?.email ||
    enquiry?.emailAddress ||
    ""
  );
};

const getEnquiryPhone = (enquiry) => {
  return (
    enquiry?.phone ||
    enquiry?.phoneNumber ||
    enquiry?.mobile ||
    ""
  );
};

const getEnquirySubject = (enquiry) => {
  return (
    enquiry?.subject ||
    enquiry?.title ||
    enquiry?.enquiryType ||
    "General Enquiry"
  );
};

const getEnquiryMessage = (enquiry) => {
  return (
    enquiry?.message ||
    enquiry?.description ||
    enquiry?.query ||
    ""
  );
};

const getEnquiryCompany = (enquiry) => {
  return (
    enquiry?.company ||
    enquiry?.companyName ||
    ""
  );
};

const getEnquiryDate = (enquiry) => {
  return (
    enquiry?.createdAt ||
    enquiry?.submittedAt ||
    enquiry?.date ||
    null
  );
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  );
};

const formatDateTime = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleString(
    "en-IN",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
};

// ============================================================
// COMPONENT
// ============================================================

const Enquiries = () => {
  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  const [enquiries, setEnquiries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("ALL");

  const [selectedEnquiry, setSelectedEnquiry] =
    useState(null);

  const [viewModalOpen, setViewModalOpen] =
    useState(false);

  const [deleteTarget, setDeleteTarget] =
    useState(null);

  const [deleteLoading, setDeleteLoading] =
    useState(false);

  const [statusUpdating, setStatusUpdating] =
    useState(null);

  // ----------------------------------------------------------
  // FETCH
  // ----------------------------------------------------------

  const fetchEnquiries = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError("");

        const response =
          await enquiryService.getAll();

        const data =
          response?.enquiries ||
          response?.data ||
          [];

        setEnquiries(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (err) {
        console.error(
          "Fetch enquiries error:",
          err
        );

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load enquiries."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchEnquiries();
  }, [fetchEnquiries]);

  // ----------------------------------------------------------
  // STATS
  // ----------------------------------------------------------

  const stats = useMemo(() => {
    const total = enquiries.length;

    const newCount =
      enquiries.filter(
        (item) =>
          getStatus(item) === "NEW"
      ).length;

    const progressCount =
      enquiries.filter(
        (item) =>
          getStatus(item) ===
          "IN_PROGRESS"
      ).length;

    const resolvedCount =
      enquiries.filter(
        (item) =>
          getStatus(item) ===
          "RESOLVED"
      ).length;

    return {
      total,
      newCount,
      progressCount,
      resolvedCount,
    };
  }, [enquiries]);

  // ----------------------------------------------------------
  // FILTER
  // ----------------------------------------------------------

  const filteredEnquiries = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return enquiries.filter(
      (enquiry) => {
        const status =
          getStatus(enquiry);

        if (
          statusFilter !== "ALL" &&
          status !== statusFilter
        ) {
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
          getEnquiryCompany(enquiry),
          getEnquiryMessage(enquiry),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          query
        );
      }
    );
  }, [
    enquiries,
    search,
    statusFilter,
  ]);

  // ----------------------------------------------------------
  // VIEW
  // ----------------------------------------------------------

  const openViewModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewModalOpen(true);
  };

  const closeViewModal = () => {
    setViewModalOpen(false);
    setSelectedEnquiry(null);
  };

  // ----------------------------------------------------------
  // STATUS UPDATE
  // ----------------------------------------------------------

  const handleStatusChange = async (
    enquiry,
    status
  ) => {
    const id = enquiry?.id;

    if (!id) {
      return;
    }

    try {
      setStatusUpdating(id);

      await enquiryService.updateStatus(
        id,
        status
      );

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
      console.error(
        "Update enquiry status error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to update enquiry status."
      );
    } finally {
      setStatusUpdating(null);
    }
  };

  // ----------------------------------------------------------
  // DELETE
  // ----------------------------------------------------------

  const openDeleteModal = (
    enquiry
  ) => {
    setDeleteTarget(enquiry);
  };

  const closeDeleteModal = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    try {
      setDeleteLoading(true);

      await enquiryService.remove(
        deleteTarget.id
      );

      setEnquiries((current) =>
        current.filter(
          (item) =>
            item.id !==
            deleteTarget.id
        )
      );

      if (
        selectedEnquiry?.id ===
        deleteTarget.id
      ) {
        closeViewModal();
      }

      setDeleteTarget(null);
    } catch (err) {
      console.error(
        "Delete enquiry error:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to delete enquiry."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ----------------------------------------------------------
  // ESCAPE
  // ----------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.key !== "Escape"
      ) {
        return;
      }

      if (deleteTarget) {
        closeDeleteModal();
        return;
      }

      if (viewModalOpen) {
        closeViewModal();
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [
    deleteTarget,
    viewModalOpen,
    deleteLoading,
  ]);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mmics-enquiries">
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="mmics-enquiries-header">
        <div className="mmics-enquiries-heading">
          <div className="mmics-enquiries-breadcrumb">
            <span>Admin</span>
            <span className="separator">
              /
            </span>
            <span className="current">
              Enquiries
            </span>
          </div>

          <div className="mmics-enquiries-title-row">
            <div className="mmics-enquiries-title-icon">
              <MessageSquare size={22} />
            </div>

            <div>
              <h1>
                Enquiries
              </h1>

              <p>
                Manage website enquiries
                and customer requests.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mmics-enquiries-refresh"
          onClick={() =>
            fetchEnquiries(true)
          }
          disabled={
            loading || refreshing
          }
        >
          {refreshing ? (
            <Loader2
              size={17}
              className="spin"
            />
          ) : (
            <RefreshCw size={17} />
          )}

          <span>
            Refresh
          </span>
        </button>
      </div>

      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mmics-enquiries-alert">
          <AlertCircle size={18} />

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* ======================================================
          STATS
      ====================================================== */}

      <div className="mmics-enquiries-stats">
        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon total">
            <MessageSquare
              size={20}
            />
          </div>

          <div className="stat-content">
            <span>
              Total Enquiries
            </span>

            <strong>
              {stats.total}
            </strong>

            <small>
              All received enquiries
            </small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon new">
            <AlertCircle
              size={20}
            />
          </div>

          <div className="stat-content">
            <span>
              New
            </span>

            <strong>
              {stats.newCount}
            </strong>

            <small>
              Need attention
            </small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon progress">
            <Clock3 size={20} />
          </div>

          <div className="stat-content">
            <span>
              In Progress
            </span>

            <strong>
              {stats.progressCount}
            </strong>

            <small>
              Currently handling
            </small>
          </div>
        </div>

        <div className="mmics-enquiries-stat-card">
          <div className="stat-icon resolved">
            <CheckCircle2
              size={20}
            />
          </div>

          <div className="stat-content">
            <span>
              Resolved
            </span>

            <strong>
              {stats.resolvedCount}
            </strong>

            <small>
              Successfully handled
            </small>
          </div>
        </div>
      </div>

      {/* ======================================================
          TOOLBAR
      ====================================================== */}

      <div className="mmics-enquiries-toolbar">
        <div className="mmics-enquiries-search">
          <Search size={18} />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Search enquiries..."
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              <X size={15} />
            </button>
          )}
        </div>

        <div className="mmics-enquiries-filters">
          {STATUS_OPTIONS.map(
            (option) => (
              <button
                key={option.value}
                type="button"
                className={
                  statusFilter ===
                  option.value
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setStatusFilter(
                    option.value
                  )
                }
              >
                {option.label}

                {option.value !==
                  "ALL" && (
                  <span>
                    {option.value ===
                    "NEW"
                      ? stats.newCount
                      : option.value ===
                        "IN_PROGRESS"
                      ? stats.progressCount
                      : stats.resolvedCount}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

      <div className="mmics-enquiries-table-card">
        <div className="mmics-enquiries-table-header">
          <div>
            <h2>
              Enquiry List
            </h2>

            <p>
              {filteredEnquiries.length}{" "}
              result
              {filteredEnquiries.length !==
              1
                ? "s"
                : ""}
            </p>
          </div>

          <div className="table-header-meta">
            <MessageSquare
              size={17}
            />

            <span>
              {filteredEnquiries.length}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="mmics-enquiries-loading">
            <Loader2
              size={30}
              className="spin"
            />

            <p>
              Loading enquiries...
            </p>
          </div>
        ) : filteredEnquiries.length ===
          0 ? (
          <div className="mmics-enquiries-empty">
            <div className="empty-icon">
              <MessageSquare
                size={28}
              />
            </div>

            <h3>
              No enquiries found
            </h3>

            <p>
              {search ||
              statusFilter !==
                "ALL"
                ? "Try changing your search or filter."
                : "Website enquiries will appear here."}
            </p>

            {(search ||
              statusFilter !==
                "ALL") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter(
                    "ALL"
                  );
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="mmics-enquiries-table-wrapper">
            <table className="mmics-enquiries-table">
              <thead>
                <tr>
                  <th>
                    Contact
                  </th>

                  <th>
                    Enquiry
                  </th>

                  <th>
                    Company
                  </th>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                  <th className="action-column">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredEnquiries.map(
                  (enquiry) => {
                    const status =
                      getStatus(
                        enquiry
                      );

                    const config =
                      getStatusConfig(
                        status
                      );

                    const StatusIcon =
                      config.icon;

                    return (
                      <tr
                        key={
                          enquiry.id
                        }
                      >
                        {/* CONTACT */}

                        <td>
                          <div className="enquiry-contact">
                            <div className="contact-avatar">
                              {getEnquiryName(
                                enquiry
                              )
                                .charAt(
                                  0
                                )
                                .toUpperCase()}
                            </div>

                            <div className="contact-info">
                              <strong>
                                {getEnquiryName(
                                  enquiry
                                )}
                              </strong>

                              <span>
                                {getEnquiryEmail(
                                  enquiry
                                ) ||
                                  "No email"}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* ENQUIRY */}

                        <td>
                          <div className="enquiry-subject">
                            <strong>
                              {getEnquirySubject(
                                enquiry
                              )}
                            </strong>

                            <span>
                              {getEnquiryMessage(
                                enquiry
                              ) ||
                                "No message"}
                            </span>
                          </div>
                        </td>

                        {/* COMPANY */}

                        <td>
                          <div className="company-cell">
                            {getEnquiryCompany(
                              enquiry
                            ) ? (
                              <>
                                <Building2
                                  size={15}
                                />

                                <span>
                                  {getEnquiryCompany(
                                    enquiry
                                  )}
                                </span>
                              </>
                            ) : (
                              <span className="muted">
                                —
                              </span>
                            )}
                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <div className="date-cell">
                            <CalendarDays
                              size={15}
                            />

                            <span>
                              {formatDate(
                                getEnquiryDate(
                                  enquiry
                                )
                              )}
                            </span>
                          </div>
                        </td>

                        {/* STATUS */}

                        <td>
                          <div className="status-wrapper">
                            <div
                              className={`enquiry-status ${config.className}`}
                            >
                              <StatusIcon
                                size={14}
                              />

                              <span>
                                {
                                  config.label
                                }
                              </span>
                            </div>

                            <div className="status-select-wrapper">
                              <select
                                value={
                                  status
                                }
                                disabled={
                                  statusUpdating ===
                                  enquiry.id
                                }
                                onChange={(
                                  event
                                ) =>
                                  handleStatusChange(
                                    enquiry,
                                    event
                                      .target
                                      .value
                                  )
                                }
                              >
                                <option value="NEW">
                                  New
                                </option>

                                <option value="IN_PROGRESS">
                                  In Progress
                                </option>

                                <option value="RESOLVED">
                                  Resolved
                                </option>
                              </select>

                              <ChevronDown
                                size={13}
                              />
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
                              onClick={() =>
                                openViewModal(
                                  enquiry
                                )
                              }
                            >
                              <Eye
                                size={16}
                              />
                            </button>

                            <button
                              type="button"
                              className="delete"
                              title="Delete enquiry"
                              onClick={() =>
                                openDeleteModal(
                                  enquiry
                                )
                              }
                            >
                              <Trash2
                                size={16}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ======================================================
          VIEW MODAL
      ====================================================== */}

      {viewModalOpen &&
        selectedEnquiry && (
          <div
            className="mmics-enquiries-modal-backdrop"
            onMouseDown={(
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeViewModal();
              }
            }}
          >
            <div className="mmics-enquiries-view-modal">
              <div className="view-modal-header">
                <div>
                  <div className="view-modal-kicker">
                    ENQUIRY DETAILS
                  </div>

                  <h2>
                    {getEnquirySubject(
                      selectedEnquiry
                    )}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={
                    closeViewModal
                  }
                >
                  <X size={19} />
                </button>
              </div>

              <div className="view-modal-body">
                {/* CONTACT CARD */}

                <div className="enquiry-detail-contact">
                  <div className="large-avatar">
                    {getEnquiryName(
                      selectedEnquiry
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {getEnquiryName(
                        selectedEnquiry
                      )}
                    </strong>

                    <span>
                      {getEnquiryCompany(
                        selectedEnquiry
                      ) ||
                        "Website enquiry"}
                    </span>
                  </div>
                </div>

                {/* DETAILS */}

                <div className="detail-grid">
                  <div className="detail-item">
                    <span>
                      <Mail
                        size={15}
                      />
                      Email
                    </span>

                    {getEnquiryEmail(
                      selectedEnquiry
                    ) ? (
                      <a
                        href={`mailto:${getEnquiryEmail(
                          selectedEnquiry
                        )}`}
                      >
                        {
                          getEnquiryEmail(
                            selectedEnquiry
                          )
                        }

                        <ArrowUpRight
                          size={13}
                        />
                      </a>
                    ) : (
                      <strong>
                        —
                      </strong>
                    )}
                  </div>

                  <div className="detail-item">
                    <span>
                      <Phone
                        size={15}
                      />
                      Phone
                    </span>

                    {getEnquiryPhone(
                      selectedEnquiry
                    ) ? (
                      <a
                        href={`tel:${getEnquiryPhone(
                          selectedEnquiry
                        )}`}
                      >
                        {
                          getEnquiryPhone(
                            selectedEnquiry
                          )
                        }

                        <ArrowUpRight
                          size={13}
                        />
                      </a>
                    ) : (
                      <strong>
                        —
                      </strong>
                    )}
                  </div>

                  <div className="detail-item">
                    <span>
                      <Building2
                        size={15}
                      />
                      Company
                    </span>

                    <strong>
                      {getEnquiryCompany(
                        selectedEnquiry
                      ) ||
                        "—"}
                    </strong>
                  </div>

                  <div className="detail-item">
                    <span>
                      <CalendarDays
                        size={15}
                      />
                      Submitted
                    </span>

                    <strong>
                      {formatDateTime(
                        getEnquiryDate(
                          selectedEnquiry
                        )
                      )}
                    </strong>
                  </div>
                </div>

                {/* MESSAGE */}

                <div className="message-section">
                  <div className="section-label">
                    <FileText
                      size={16}
                    />

                    <span>
                      Message
                    </span>
                  </div>

                  <div className="message-box">
                    {getEnquiryMessage(
                      selectedEnquiry
                    ) || (
                      <span className="muted">
                        No message provided.
                      </span>
                    )}
                  </div>
                </div>

                {/* STATUS */}

                <div className="view-status-section">
                  <div>
                    <span>
                      Current status
                    </span>

                    <strong>
                      {
                        getStatusConfig(
                          getStatus(
                            selectedEnquiry
                          )
                        ).label
                      }
                    </strong>
                  </div>

                  <select
                    value={getStatus(
                      selectedEnquiry
                    )}
                    disabled={
                      statusUpdating ===
                      selectedEnquiry.id
                    }
                    onChange={(
                      event
                    ) =>
                      handleStatusChange(
                        selectedEnquiry,
                        event
                          .target
                          .value
                      )
                    }
                  >
                    <option value="NEW">
                      New
                    </option>

                    <option value="IN_PROGRESS">
                      In Progress
                    </option>

                    <option value="RESOLVED">
                      Resolved
                    </option>
                  </select>
                </div>
              </div>

              <div className="view-modal-footer">
                <button
                  type="button"
                  className="secondary"
                  onClick={
                    closeViewModal
                  }
                >
                  Close
                </button>

                {getEnquiryEmail(
                  selectedEnquiry
                ) && (
                  <a
                    className="primary"
                    href={`mailto:${getEnquiryEmail(
                      selectedEnquiry
                    )}`}
                  >
                    <Mail size={16} />
                    Reply by Email
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

      {/* ======================================================
          DELETE MODAL
      ====================================================== */}

      {deleteTarget && (
        <div
          className="mmics-enquiries-modal-backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeDeleteModal();
            }
          }}
        >
          <div className="mmics-enquiries-delete-modal">
            <div className="delete-icon">
              <Trash2 size={23} />
            </div>

            <h2>
              Delete enquiry?
            </h2>

            <p>
              This will permanently
              remove the enquiry from
              your admin portal.
            </p>

            <div className="delete-preview">
              <strong>
                {getEnquiryName(
                  deleteTarget
                )}
              </strong>

              <span>
                {getEnquirySubject(
                  deleteTarget
                )}
              </span>
            </div>

            <div className="delete-actions">
              <button
                type="button"
                className="cancel"
                onClick={
                  closeDeleteModal
                }
                disabled={
                  deleteLoading
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="confirm"
                onClick={
                  handleDelete
                }
                disabled={
                  deleteLoading
                }
              >
                {deleteLoading ? (
                  <>
                    <Loader2
                      size={16}
                      className="spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2
                      size={16}
                    />

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


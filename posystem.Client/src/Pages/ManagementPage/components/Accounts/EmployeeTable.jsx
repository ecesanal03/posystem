import PropTypes from 'prop-types';
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Box,
  IconButton,
  Chip,
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return { bg: 'rgba(233, 30, 99, 0.1)', color: '#e91e63', border: '#e91e63' };
      case 'manager':
        return { bg: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0', border: '#9c27b0' };
      case 'cashier':
        return { bg: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', border: '#2196f3' };
      default:
        return { bg: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e', border: '#9e9e9e' };
    }
  };

  return (
    <Paper elevation={2} sx={{ 
      bgcolor: '#2A2D2A', 
      borderRadius: 1, 
      border: '1px solid #61677A',
      width: '100%',
      maxWidth: '1200px',
      mx: 'auto'
    }}>
      <TableContainer sx={{ maxHeight: 'calc(100vh - 300px)', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead sx={{ borderBottom: '3px solid #61677A' }}>
            <TableRow>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Employee ID</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Name</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Email</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Role</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Start Date</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}>Status</TableCell>
              <TableCell sx={{ py: 1.5, bgcolor: '#2A2D2A' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((employee) => {
                const roleColors = getRoleColor(employee.role);
                return (
                  <TableRow 
                    key={employee.id} 
                    hover
                    sx={{ 
                      '&:last-child td, &:last-child th': { 
                        border: 0 
                      },
                      '& td': {
                        borderColor: '#61677A'
                      },
                      '&:hover': {
                        bgcolor: 'rgba(97, 103, 122, 0.1)'
                      }
                    }}
                  >
                    <TableCell>{employee.employee_id}</TableCell>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.role}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: roleColors.bg,
                          color: roleColors.color,
                          borderColor: roleColors.border,
                          textTransform: 'capitalize',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>{formatDate(employee.start_date)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.active ? 'Active' : 'Inactive'}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: employee.active ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                          color: employee.active ? '#4caf50' : '#f44336',
                          borderColor: employee.active ? '#4caf50' : '#f44336',
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex' }}>
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(employee)}
                          sx={{ 
                            color: '#4caf50',
                            mr: 1,
                            '&:hover': { 
                              bgcolor: 'rgba(76, 175, 80, 0.1)' 
                            }
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          onClick={() => onDelete(employee)}
                          sx={{ 
                            color: '#ff6b6b',
                            '&:hover': { 
                              bgcolor: 'rgba(255, 107, 107, 0.1)' 
                            }
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No employees found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

EmployeeTable.propTypes = {
  employees: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      employee_id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      role: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      active: PropTypes.bool.isRequired,
      phone: PropTypes.string,
      address: PropTypes.string
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EmployeeTable;

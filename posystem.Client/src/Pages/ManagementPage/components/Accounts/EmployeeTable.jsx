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
  Chip
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const EmployeeTable = ({ employees, onEdit, onDelete }) => {
  // For debugging - log the received employees data
  console.log('EmployeeTable received:', employees);

  const getRoleColor = (role) => {
    role = (role || '').toLowerCase();
    switch (role) {
      case 'admin':
      case 'administrator':
        return { bg: 'rgba(156, 39, 176, 0.1)', color: '#9c27b0', border: '#9c27b0' };
      case 'manager':
        return { bg: 'rgba(33, 150, 243, 0.1)', color: '#2196f3', border: '#2196f3' };
      case 'cashier':
      default:
        return { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '#4caf50' };
    }
  };

  const getStatusColor = (status) => {
    return status
      ? { bg: 'rgba(76, 175, 80, 0.1)', color: '#4caf50', border: '#4caf50' }
      : { bg: 'rgba(244, 67, 54, 0.1)', color: '#f44336', border: '#f44336' };
  };

  return (
    <Paper elevation={2} sx={{ 
      bgcolor: '#2A2D2A', 
      borderRadius: 1, 
      border: '1px solid #61677A',
      width: '100%',
      maxWidth: '1200px'
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
              employees.map((employee, index) => {
                const roleStyles = getRoleColor(employee.Role);
                const statusStyles = getStatusColor(employee.Status);
                
                return (
                  <TableRow 
                    key={employee.Id || `employee-${index}`}
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
                    <TableCell>{employee.Id || 'N/A'}</TableCell>
                    <TableCell>{employee.Name || 'N/A'}</TableCell>
                    <TableCell>{employee.Email || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.Role || 'N/A'}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: roleStyles.bg,
                          color: roleStyles.color,
                          borderColor: roleStyles.border,
                          fontWeight: 500,
                          fontSize: '0.75rem',
                          textTransform: 'capitalize'
                        }}
                      />
                    </TableCell>
                    <TableCell>{employee.Start_Date || 'N/A'}</TableCell>
                    <TableCell>
                      <Chip 
                        label={employee.Status ? 'Active' : 'Inactive'}
                        size="small"
                        variant="outlined"
                        sx={{
                          bgcolor: statusStyles.bg,
                          color: statusStyles.color,
                          borderColor: statusStyles.border,
                          fontWeight: 500,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          size="small" 
                          onClick={() => onEdit(employee)}
                          sx={{ 
                            color: '#90caf9',
                            '&:hover': { 
                              bgcolor: 'rgba(144, 202, 249, 0.1)' 
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
      Id: PropTypes.string,
      Name: PropTypes.string,
      Email: PropTypes.string,
      Role: PropTypes.string,
      Start_Date: PropTypes.string,
      Status: PropTypes.bool
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default EmployeeTable;

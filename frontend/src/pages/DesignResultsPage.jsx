import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import DesignGrid from '../components/DesignGrid';
import { pageTransition } from '../utils/animations';

export default function DesignResultsPage() {
  const { generatedDesigns, designInput } = useStore();
  const navigate = useNavigate();
  const pageRef = useRef(null);

  useEffect(() => {
    if (!generatedDesigns.length) { navigate('/'); return; }
    if (pageRef.current) pageTransition(pageRef.current);
  }, []);

  return (
    <div className="page-transition-wrapper" ref={pageRef} style={{ paddingTop: '100px', minHeight: '80vh' }}>
      <div className="container">
        {designInput && (
          <div style={{ textAlign: 'center', marginBottom: '8px' }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Your <span className="gradient-text">Designs</span> Are Ready
            </h2>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <span className="badge badge-info">{designInput.business_name}</span>
              <span className="badge badge-success">{designInput.category}</span>
              <span className="badge badge-warning">{designInput.bottle_size}</span>
              <span className="badge" style={{ background: 'rgba(108,92,231,0.15)', color: 'var(--accent-light)' }}>{designInput.style}</span>
            </div>
          </div>
        )}
        <DesignGrid designs={generatedDesigns} />
        <div style={{ textAlign: 'center', marginTop: '40px', paddingBottom: '40px' }}>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>{'<'} Generate New Designs</button>
        </div>
      </div>
    </div>
  );
}


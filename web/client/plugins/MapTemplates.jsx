/*
 * Copyright 2019, GeoSolutions Sas.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { get } from 'lodash';
import { connect } from 'react-redux';
import { Glyphicon } from 'react-bootstrap';
import { createSelector } from 'reselect';
import { createPlugin } from '../utils/PluginsUtils';

import { toggleControl } from '../actions/controls';
import { templatesSelector, mapTemplatesLoadedSelector } from '../selectors/maptemplates';
import { openMapTemplatesPanel, mergeTemplate, replaceTemplate, toggleFavouriteTemplate } from '../actions/maptemplates';

import Message from '../components/I18N/Message';
import Loader from '../components/misc/Loader';
import DockPanel from '../components/misc/panels/DockPanel';
import MapTemplatesPanel from '../components/maptemplates/MapTemplatesPanel';

import maptemplates from '../reducers/maptemplates';
import * as epics from '../epics/maptemplates';

const mapTemplates = ({
    active,
    templates = [],
    templatesLoaded,
    onToggleControl = () => {},
    onMergeTemplate = () => {},
    onReplaceTemplate = () => {},
    onToggleFavourite = () => {}
}) => {
    return (
        <DockPanel
            open={active}
            position="right"
            size={660}
            bsStyle="primary"
            title={<Message msgId="mapTemplates.title"/>}
            style={{ height: 'calc(100% - 30px)' }}
            onClose={onToggleControl}>
            {!templatesLoaded && <div className="map-templates-loader"><Loader size={352}/></div>}
            {templatesLoaded && <MapTemplatesPanel
                templates={templates}
                onMergeTemplate={onMergeTemplate}
                onReplaceTemplate={onReplaceTemplate}
                onToggleFavourite={onToggleFavourite}/>}
        </DockPanel>
    );
};

const MapTemplatesPlugin = connect(createSelector(
    state => get(state, 'controls.mapTemplates.enabled'),
    templatesSelector,
    mapTemplatesLoadedSelector,
    (active, templates, templatesLoaded) => ({
        active,
        templates,
        templatesLoaded
    })
), {
    onToggleControl: toggleControl.bind(null, 'mapTemplates', 'enabled'),
    onMergeTemplate: mergeTemplate,
    onReplaceTemplate: replaceTemplate,
    onToggleFavourite: toggleFavouriteTemplate
})(mapTemplates);

export default createPlugin('MapTemplates', {
    component: MapTemplatesPlugin,
    containers: {
        BurgerMenu: {
            name: 'MapTemplates',
            position: 998,
            text: <Message msgId="mapTemplates.title" />,
            icon: <Glyphicon glyph="1-map" />,
            action: openMapTemplatesPanel,
            priority: 2,
            doNotHide: true
        }
    },
    reducers: {
        maptemplates
    },
    epics
});
